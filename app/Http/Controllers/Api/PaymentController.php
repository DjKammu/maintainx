<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\DocumentType;
use App\Models\PropertyType;
use App\Models\AssetModel;
use App\Models\Contractor;
use App\Models\AssetType;
use App\Models\WorkType;
use App\Models\Property;
use App\Models\Payment;
use App\Models\Tenant;
use App\Models\Vendor;
use App\Models\SubArea;
use App\Models\Area;
use App\Models\User;
use App\Models\Mail;
use App\Mail\MaitTo;
use Validator;
use Gate;
use PDF;

class PaymentController extends Controller
{
   /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if(Gate::denies('view')) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 

        $allData = $this->getData($request);
        $data = @$allData['data'];
        $grandTotal = @$allData['grandTotal'];

        return response()->json([
            'message' => $data,
            'grandTotal' => Payment::format($grandTotal),
            'status' => 'success'
        ]);
    }

    public function getData($request){

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];

        $whereUserProperties = User::userProperties();

        $data = Payment::when($whereUserProperties, function ($q) use 
               ($whereUserProperties) {
                $q->whereIn('property_id', $whereUserProperties);
              });

        if ($sortBy && $sortType) {
            $data->orderBy('payments.'.$sortBy, $sortType);
        }


        if ($request['query'] != '') {
            $data->where('brand', 'like', '%' . $request['query'] . '%');
            $data->orWhere('description', 'like', '%' . $request['query'] . '%');
        }
        
        if ($request['id'] != '') {
            $data->where('id',$request['id']);
        }
       
       $property_type = $request['property_type'];
       $data->where(function($q) use ($property_type){
              $q->whereHas('property_type', function($q) use ($property_type){
                  $q->when($property_type, function ($q) use 
                   ($property_type) {
                      $q->where('id',$property_type);
                  });
              })->when(!$property_type, function ($q){
                      $q->orWhereNull('property_type_id');
              });
        });

       $property = $request['property'];
        $data->where(function($q) use ($property){
              $q->whereHas('property', function($q) use ($property){
                  $q->when($property, function ($q) use 
                   ($property) {
                      $q->where('id',$property);
                  });
              })->when(!$property, function ($q){
                      $q->orWhereNull('property_id');
              });
        });

        $area = $request['area'];
        $data->where(function($q) use ($area){
              $q->whereHas('area', function($q) use ($area){
                  $q->when($area, function ($q) use 
                   ($area) {
                      $q->where('id',$area);
                  });
              })->when(!$area, function ($q){
                      $q->orWhereNull('area_id');
              });
        });
        
        $sub_area = $request['sub_area'];
        $data->where(function($q) use ($sub_area){
              $q->whereHas('sub_area', function($q) use ($sub_area){
                  $q->when($sub_area, function ($q) use 
                   ($sub_area) {
                      $q->where('id',$sub_area);
                  });
              })->when(!$sub_area, function ($q){
                      $q->orWhereNull('sub_area_id');
              });
        });


        $tenant = $request['tenant'];

        $data->where(function($q) use ($tenant){
              $q->whereHas('tenant', function($q) use ($tenant){
                  $q->when($tenant, function ($q) use 
                   ($tenant) {
                      $q->where('id',$tenant);
                  });
              })->when(!$tenant, function ($q){
                      $q->orWhereNull('tenant_id');
              });
        }); 

         $contractor = $request['contractor'];

         $data->where(function($q) use ($contractor){
              $q->whereHas('contractor', function($q) use ($contractor){
                  $q->when($contractor, function ($q) use 
                   ($contractor) {
                      $q->where('id',$contractor);
                  });
              })->when(!$contractor, function ($q){
                      $q->orWhereNull('contractor_id');
              });
        });
        
        $vendor = $request['vendor'];

        $data->where(function($q) use ($vendor){
              $q->whereHas('vendor', function($q) use ($vendor){
                  $q->when($vendor, function ($q) use 
                   ($vendor) {
                      $q->where('id',$vendor);
                  });
              })->when(!$vendor, function ($q){
                      $q->orWhereNull('vendor_id');
              });
        });


        $work_type = $request['work_type'];
        $data->where(function($q) use ($work_type){
              $q->whereHas('work_type', function($q) use ($work_type){
                  $q->when($work_type, function ($q) use 
                   ($work_type) {
                      $q->where('id',$work_type);
                  });
              })->when(!$work_type, function ($q){
                      $q->orWhereNull('work_type_id');
              });
        });

        $asset_type = $request['asset_type'];
        $data->where(function($q) use ($asset_type){
              $q->whereHas('asset_type', function($q) use ($asset_type){
                  $q->when($asset_type, function ($q) use 
                   ($asset_type) {
                      $q->where('id',$asset_type);
                  });
              })->when(!$asset_type, function ($q){
                      $q->orWhereNull('asset_type_id');
              });
        });

        $asset_model = $request['asset_model'];
        $data->where(function($q) use ($asset_model){
              $q->whereHas('asset_model', function($q) use ($asset_model){
                  $q->when($asset_model, function ($q) use 
                   ($asset_model) {
                      $q->where('id',$asset_model);
                  });
              })->when(!$asset_model, function ($q){
                      $q->orWhereNull('asset_model_id');
              });
        });
        
        $allData =  $data->get();

        $grandTotal = 0;

        $dt = @collect($allData)->filter(function($payment) use (&$grandTotal){
                 $grandTotal =  @$payment->getRawOriginal('payment') + $grandTotal;
        });

        if(request()->is('*/payments/download') || request()->is('*/payments/mail')){
           $data = $allData;
           $vData = $allData;
           $items = $allData;
        } else{
              $data = $data->paginate($perPage);
              $vData =  @$data->data; 
              $items = $data->items();
        }
          

        $vData = @collect($items)->filter(function($payment) use (&$grandTotal){
               //  $grandTotal = $payment->payment + $grandTotal;
          
                 $payment->property_name = $payment->property->name; 
                 if(@$payment->property ){
                    @$payment->property->label = $payment->property->name;
                    @$payment->property->value = $payment->property->id;
                 }

                 $payment->property_type_name = $payment->property_type->name; 
                 if(@$payment->property_type ){
                    @$payment->property_type->label = $payment->property_type->name;
                    @$payment->property_type->value = $payment->property_type->id;
                 }

                 $payment->area_name = $payment->area->name; 
                 if(@$payment->area ){
                    @$payment->area->label = $payment->area->name;
                    @$payment->area->value = $payment->area->id;
                 }

                 $payment->area_name = $payment->area->name; 
                 if(@$payment->area ){
                    @$payment->area->label = $payment->area->name;
                    @$payment->area->value = $payment->area->id;
                 }

                 $payment->sub_area_name = $payment->sub_area->name; 
                 if(@$payment->sub_area ){
                    @$payment->sub_area->label = $payment->sub_area->name;
                    @$payment->sub_area->value = $payment->sub_area->id;
                 }

                 $payment->asset_type_name = $payment->asset_type->name; 
                 if(@$payment->asset_type ){
                    @$payment->asset_type->label = $payment->asset_type->name;
                    @$payment->asset_type->value = $payment->asset_type->id;
                 } 

                 $payment->asset_model_name = $payment->asset_model->name; 
                 if(@$payment->asset_model ){
                    @$payment->asset_model->label = $payment->asset_model->name;
                    @$payment->asset_model->value = $payment->asset_model->id;
                 } 

                 $payment->vendor_name = (@$payment->vendor->company_name && @$payment->vendor->name ) ? ( @$payment->vendor->company_name .'-'. @$payment->vendor->name ) : (@$payment->vendor->company_name ? @$payment->vendor->company_name : @$payment->vendor->name);
                 
                 if(@$payment->vendor ){
                    @$payment->vendor->label = (@$payment->vendor->company_name && @$payment->vendor->name ) ? ( @$payment->vendor->company_name .'-'. @$payment->vendor->name ) : (@$payment->vendor->company_name ? @$payment->vendor->company_name : @$payment->vendor->name);
                    @$payment->vendor->value = $payment->vendor->id;
                 }

                 $payment->contractor_name = (@$payment->contractor->company_name && @$payment->contractor->name ) ? ( @$payment->contractor->company_name .'-'. @$payment->contractor->name ) : (@$payment->contractor->company_name ? @$payment->contractor->company_name : @$payment->contractor->name);
                 if(@$payment->contractor ){
                    @$payment->contractor->label = (@$payment->contractor->company_name && @$payment->contractor->name ) ? ( @$payment->contractor->company_name .'-'. @$payment->contractor->name ) : (@$payment->contractor->company_name ? @$payment->contractor->company_name : @$payment->contractor->name);
                    @$payment->contractor->value = $payment->contractor->id;
                 }

                  $payment->tenant_name = $payment->tenant->name; 
                 if(@$payment->tenant ){
                    @$payment->tenant->label = $payment->tenant->name;
                    @$payment->tenant->value = $payment->tenant->id;
                 }

                 $payment->work_type_name = $payment->work_type->name; 
                 if(@$payment->work_type ){
                    @$payment->work_type->label = $payment->work_type->name;
                    @$payment->work_type->value = $payment->work_type->id;
                 }

              $media =  @$payment->getMediaPathWithExtension()['file'] ? [@$payment->getMediaPathWithExtension()] : @$payment->getMediaPathWithExtension();
               $payment->media = @collect($media)->all(); 
        });
     
        return compact('data','grandTotal');

    }

    public function assetSelection(Request $request)
    { 
          
          $asset = AssetModel::where('id',$request->asset)
                       ->first();

          $asset->property_name = @$asset->property->name; 
           if(@$asset->property ){
              @$asset->property->label = $asset->property->name;
              @$asset->property->value = $asset->property->id;
           }

           $asset->area_name = @$asset->area->name; 
           if(@$asset->area ){
              @$asset->area->label = $asset->area->name;
              @$asset->area->value = $asset->area->id;
           } 

           $asset->property_type_name = @$asset->property_type->name; 
           if(@$asset->property_type ){
              @$asset->property_type->label = $asset->property_type->name;
              @$asset->property_type->value = $asset->property_type->id;
           }

           $asset->sub_area_name = @$asset->sub_area->name; 
           if(@$asset->sub_area ){
              @$asset->sub_area->label = $asset->sub_area->name;
              @$asset->sub_area->value = $asset->sub_area->id;
           }   
            
           if($asset->property_type_id &&  $asset->property_id && $asset->area_id && $asset->sub_area_id){
            
             $tenants = Tenant::where([
                         'property_type_id' => $asset->property_type_id,
                         'property_id' => $asset->property_id,
                         'area_id' => $asset->area_id,
                         'sub_area_id' => $asset->sub_area_id
             ])->where('active',Tenant::ACTIVE)->orderBy('name')->get();

            if($tenants){

                $tenants = @$tenants->filter(function($tenant){
                    $tenant->label = $tenant->name;
                    $tenant->value = $tenant->id;
                    return $tenant;
                });
            }

           }
          
         $tenants = (@$tenants) ? $tenants : [];  

         return response()->json([
            'message' => compact('asset','tenants'),
            'status' => 'success'
        ]);
    }  

    public function assets(Request $request)
    { 
          $area_id = $request->area_id;
          $sub_area_id = $request->sub_area_id;
          $asset_type = $request->asset_type;
          $whereUserProperties = User::userProperties();
          $assets = AssetModel::when($whereUserProperties, function ($q) use 
                     ($whereUserProperties) {
                      $q->whereIn('property_id', $whereUserProperties);
                    })->whereHas('asset_type', function($q) use ($asset_type){
                            $q->whereNull('deleted_at')
                            ->where('id',$asset_type);
                   });

          if($sub_area_id) {
              $assets = $assets->where('sub_area_id', $sub_area_id);
          } elseif($area_id) {
              $assets = $assets->orWhere('area_id', $area_id);
          }

          $assets =  $assets->orderBy('name')->get();

          if($assets){

            $assets = @$assets->filter(function($asset){
                $asset->label = $asset->name;
                $asset->value = $asset->id;
                return $asset;
            });
          }
      
         $assets = ($assets) ? $assets : [];  
         
         return response()->json([
            'message' => compact('assets'),
            'status' => 'success'
        ]);
    }  

    public function property(Request $request)
    { 
          $whereUserProperties = User::userProperties();
          $properties = Property::when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('id', $whereUserProperties);
                        })->where('property_type_id',$request->property_type)
                       ->whereNotNull('property_type_id')->orderBy('name');

        if($request['p']){
             $properties->where('name', 'like', '%' . $request['p'] . '%');
        } 
        $data = [];
        $properties = $properties->get();      
            
         if($properties){
            $properties = @$properties->filter(function($property){
                $property->label = $property->name;
                $property->value = $property->id;
                return $property;
            });
          }
         $property = ($properties) ? $properties : []; 
         $data = $property; 
         
         return response()->json([
            'message' => compact('property','data'),
            'status' => 'success'
        ]);
    }

    public function area(Request $request)
    { 
          $whereUserProperties = User::userProperties();
          $areas = Area::when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('property_id', $whereUserProperties);
                        })->where('property_id',$request->property)
                       ->whereNotNull('property_id')
                       ->orderBy('name');

         if($request['a']){
             $areas->where('name', 'like', '%' . $request['a'] . '%');
        } 
        $data = [];  
        $areas = $areas->get();             
            
        if($areas){
            $areas = @$areas->filter(function($ar){
                $ar->label = $ar->name;
                $ar->value = $ar->id;
                return $ar;
            });
          }
         $area = ($areas) ? $areas : []; 
         $data = $areas; 
         
         return response()->json([
            'message' => compact('area','data'),
            'status' => 'success'
        ]);
    }
 

 public function subArea(Request $request)
    { 
          $whereUserProperties = User::userProperties();
          $subareas = SubArea::when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('property_id', $whereUserProperties);
                        })->where('area_id',$request->area)
                       ->whereNotNull('area_id')
                       ->orderBy('name');
        if($request['sa']){
             $subareas->where('name', 'like', '%' . $request['a'] . '%');
        } 
        $data = [];  
        $subareas = $subareas->get();               
            
         if($subareas){
            $subareas = @$subareas->filter(function($sa){
                $sa->label = $sa->name;
                $sa->value = $sa->id;
                return $sa;
            });
          }
         $sub_area = ($subareas) ? $subareas : [];  
         $data = $sub_area;
         
         return response()->json([
            'message' => compact('sub_area','data'),
            'status' => 'success'
        ]);
    }

    public function tenant (Request $request)
    { 
          $asset_type_id = $request->asset_type_id;
          $whereUserProperties = User::userProperties(); 
          $subarea = SubArea::when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('property_id', $whereUserProperties);
                        })->where('id',$request->sub_area_id)
                       ->first();

         if (empty($subarea)) {
              return response()->json([
                  'message' => 'Sub Area Not Found',
                  'status' => 'error'
              ]);
          }             
              
         if($subarea){

          $tenants = Tenant::where([
                         'sub_area_id' => $subarea->id,
                         'area_id' => $subarea->area_id,
                         'property_id' => $subarea->property_id
             ])->when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('property_id', $whereUserProperties);
                        })->where('active',Tenant::ACTIVE)->orderBy('name')->get();;

            if($tenants){

                $tenants = @$tenants->filter(function($tenant){
                    $tenant->label = $tenant->name;
                    $tenant->value = $tenant->id;
                    return $tenant;
                });
            }

            $assets = AssetModel::where([
                         'sub_area_id' => $subarea->id,
                         'area_id' => $subarea->area_id,
                         'property_id' => $subarea->property_id
             ])->when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('property_id', $whereUserProperties);
              })->whereHas('asset_type', function($q) use ($asset_type_id){
                            $q->whereNull('deleted_at')
                            ->when($asset_type_id, function ($q) use 
                             ($asset_type_id) {
                                $q->where('id',$asset_type_id);
                            });
                   })->orderBy('name')->get();

            if($assets){

                $assets = @$assets->filter(function($asset){
                    $asset->label = $asset->name;
                    $asset->value = $asset->id;
                    return $asset;
                });
            }

          }

         $tenants = ($tenants) ? $tenants : [];  
         $assets = ($assets) ? $assets : [];  
         
         return response()->json([
            'message' => compact('tenants','assets'),
            'status' => 'success'
        ]);
    }

    public function assetType(Request $request)
    { 
          $whereUserProperties = User::userProperties();
          $properties = Property::when($whereUserProperties, function ($q) use 
                                 ($whereUserProperties) {
                                  $q->whereIn('id', $whereUserProperties);
                                })->where('property_type_id',$request->property_type)
                                ->whereNotNull('property_type_id')
                                ->orderBy('name')->get();
            
         if($properties){

            $properties = @$properties->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });
          }
         $property = ($properties) ? $properties : [];  
         
         return response()->json([
            'message' => compact('property'),
            'status' => 'success'
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function attributes(Request $request)
    { 
         $propertyTypes = PropertyType::orderBy('name')->get();
         $propertyTypes = @$propertyTypes->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });
         $assetTypes = AssetType::orderBy('name')->get();
         $assetTypes = @$assetTypes->filter(function($assetType){
              $assetType->label = $assetType->name;
              $assetType->value = $assetType->id;
              return $assetType;
          });
         
          $payment = Payment::query();
        
        if ($request['id'] != '') {
            $payment->where('id',$request['id']);
        }
        $payment = $payment->first();

        $assetModels = AssetModel::query();
        $whereUserProperties = User::userProperties();

        // if (@$payment['asset_type_id'] != '') {
        //     $assetModels->where('asset_type_id',$payment['asset_type_id']);
        // }

        $asset_type_id = $request['asset_type_id']; 

        $assetModels->whereHas('asset_type', function($q) use ($asset_type_id){
                  $q->whereNull('deleted_at')
                  ->when($asset_type_id, function ($q) use 
                   ($asset_type_id) {
                      $q->where('id',$asset_type_id);
                  });
         });

      $property_type = $request['property_type'];
      $assetModels->where(function($q) use ($property_type){
              $q->whereHas('property_type', function($q) use ($property_type){
                  $q->when($property_type, function ($q) use 
                   ($property_type) {
                      $q->where('id',$property_type);
                  });
              })->when(!$property_type, function ($q){
                      $q->orWhereNull('property_type_id');
              });
        });

       $property = $request['property'];
       $assetModels->where(function($q) use ($property){
              $q->whereHas('property', function($q) use ($property){
                  $q->when($property, function ($q) use 
                   ($property) {
                      $q->where('id',$property);
                  });
              })->when(!$property, function ($q){
                      $q->orWhereNull('property_id');
              });
        });

       $area = $request['area'];
       $assetModels->where(function($q) use ($area){
              $q->whereHas('area', function($q) use ($area){
                  $q->when($area, function ($q) use 
                   ($area) {
                      $q->where('id',$area);
                  });
              })->when(!$area, function ($q){
                      $q->orWhereNull('area_id');
              });
        });
        
        $sub_area = $request['sub_area'];
        $assetModels->where(function($q) use ($sub_area){
              $q->whereHas('sub_area', function($q) use ($sub_area){
                  $q->when($sub_area, function ($q) use 
                   ($sub_area) {
                      $q->where('id',$sub_area);
                  });
              })->when(!$sub_area, function ($q){
                      $q->orWhereNull('sub_area_id');
              });
        });


        $assetModels = $assetModels->when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('property_id', $whereUserProperties);
                        })->orderBy('name')->get();
       
       $assetModels = @$assetModels->filter(function($assetModel){
              $assetModel->label = $assetModel->name;
              $assetModel->value = $assetModel->id;
              return $assetModel;
          });
         $vendors = Vendor::orderBy('name')->get();
         $vendors = @$vendors->filter(function($vendor){
              $vendor->label = ($vendor->company_name && $vendor->name) ? ( $vendor->company_name .'-'. $vendor->name ) : ($vendor->company_name ? $vendor->company_name : $vendor->name);
              $vendor->value = $vendor->id;
              return $vendor;
          })->sortBy('label')->values();
           

         $contractors = Contractor::orderBy('name')->get();
         $contractors = @$contractors->filter(function($contractor){
              $contractor->label = ($contractor->company_name && $contractor->name) ? ( $contractor->company_name .'-'. $contractor->name ) : ($contractor->company_name ? $contractor->company_name : $contractor->name);
              $contractor->value = $contractor->id;
              return $contractor;
          })->sortBy('label')->values();

         $tenants = [];
         $allTenants = [];

        if(@$payment->tenant_id){
            
             $tenants = Tenant::where([
                         'id' => $payment->tenant_id
             ])->when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('property_id', $whereUserProperties);
                        })->where('active',Tenant::ACTIVE)->orderBy('name')->get();

            if($tenants){

                $tenants = @$tenants->filter(function($tenant){
                    $tenant->label = $tenant->name;
                    $tenant->value = $tenant->id;
                    return $tenant;
                });
            }

         }

          $allTenants = Tenant::when($whereUserProperties, function ($q) use 
                       ($whereUserProperties) {
                        $q->whereIn('property_id', $whereUserProperties);
                      });

          $allTenants->where(function($q) use ($property_type){
                $q->whereHas('property_type', function($q) use ($property_type){
                    $q->when($property_type, function ($q) use 
                     ($property_type) {
                        $q->where('id',$property_type);
                    });
                })->when(!$property_type, function ($q){
                      $q->orWhereNull('property_type_id');
              });
          });

          
          $allTenants->where(function($q) use ($property){
              $q->whereHas('property', function($q) use ($property){
                  $q->when($property, function ($q) use 
                   ($property) {
                      $q->where('id',$property);
                  });
              })->when(!$property, function ($q){
                      $q->orWhereNull('property_id');
              });
        });

        $area = $request['area'];
        $allTenants->where(function($q) use ($area){
              $q->whereHas('area', function($q) use ($area){
                  $q->when($area, function ($q) use 
                   ($area) {
                      $q->where('id',$area);
                  });
              })->when(!$area, function ($q){
                      $q->orWhereNull('area_id');
              });
        });
        
        $sub_area = $request['sub_area'];
        $allTenants->where(function($q) use ($sub_area){
              $q->whereHas('sub_area', function($q) use ($sub_area){
                  $q->when($sub_area, function ($q) use 
                   ($sub_area) {
                      $q->where('id',$sub_area);
                  });
              })->when(!$sub_area, function ($q){
                      $q->orWhereNull('sub_area_id');
              });
        });
        $data = []; 
        $allTenants->where('active',Tenant::ACTIVE)
                         ->orderBy('name');
        if($request['t']){
             $allTenants->where('name', 'like', '%' . $request['t'] . '%');
        }  
        $allTenants = $allTenants->get();
                      

        if($allTenants){
              $allTenants = @$allTenants->filter(function($tenant){
                  $tenant->label = $tenant->name;
                  $tenant->value = $tenant->id;
                  return $tenant;
              });
          }

         $workTypes = WorkType::orderBy('name');

         if($request['wt']){
             $workTypes->where('name', 'like', '%' . $request['wt'] . '%');
        }  

        $workTypes = $workTypes->get();

         $workTypes = @$workTypes->filter(function($workType){
              $workType->label = $workType->name;
              $workType->value = $workType->id;
              return $workType;
          });

         switch ($request->all()) {
           case !empty($request['t']):
               $data = $allTenants;
             break;

           case !empty($request['wt']):
               $data = $workTypes;
             break;
           
           default:
              $data = $data;
             break;
         }

          return response()->json([
            'message' => compact('propertyTypes','assetTypes','assetModels','vendors','contractors','tenants','workTypes','allTenants','data'),
            'status' => 'success'
        ]);

    }
    

    public function mails(Request $request)
    { 
         $mails = Mail::orderBy('email');

        //  if($request['wt']){
        //      $mails->where('name', 'like', '%' . $request['wt'] . '%');
        // }  

        $mails = $mails->get();

        $mails = @$mails->filter(function($mail){
              $mail->name = $mail->email;
              $mail->value = $mail->id;
              return $mail;
        });

        $rcs = $ccs = $bccs = [];
        $rcs = @$mails->where('to_type',Mail::RC)->sortBy('email')->values();
        $ccs = @$mails->where('to_type',Mail::CC)->sortBy('email')->values();
        $bccs = @$mails->where('to_type',Mail::BCC)->sortBy('email')->values();

        return response()->json([
            'message' => compact('rcs','ccs','bccs'),
            'status' => 'success'
        ]);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->except('api_token');

        if(Gate::denies('administrator') && !User::propertyBelongsToUser($data['property_id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        }  

         $validate = Validator::make($request->all(),[
              'asset_model_id' => 'nullable|string'
        ],[
            'asset_model_id.required'=> 'Asset is Required!'
           ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
         
       $create =  Payment::create($data); 

       if($request->hasFile('files')){
              $create->toPath(Payment::PAYMENT_ATTACHMENTS)
                        ->docType(DocumentType::PAYMENT)->storeFile('files',true);
        }

       if ($create) {
            return response()->json([
                'message' => 'Payment successfully saved',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
        
        
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {    
        $data = $request->except('api_token');

        if(Gate::denies('administrator') && !User::propertyBelongsToUser($data['property_id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        }  

  
        $validate = Validator::make($request->all(),[
              'asset_model_id' => 'nullable|string'
        ],[
            'asset_model_id.required'=> 'Asset is Required!'
           ]);
        
        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

       $update =  Payment::find($request['id']);
        $update->update($data);

       if($request->hasFile('files')){
              $update->toPath(Payment::PAYMENT_ATTACHMENTS)
                        ->docType(DocumentType::PAYMENT)->storeFile('files',true);
        }

       if ($update) {
          
            return response()->json([
                'message' => 'Payment successfully saved',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
       
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
   
    public function destroy(Request $request)
    {

        if(Gate::denies('administrator') && !User::propertyBelongsToUser($area['property_id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 
            
        // $password = $request->password;
        // $user = \Auth::user();

        // if(!\Hash::check($password, $user->password)) { 
        //   return response()->json(
        //        [
        //         'status' => 'error',
        //         'message' => 'Password not matched!'
        //        ]
        //     );
        // }
           
        $area = Payment::where('id',$request['id'])->first();
        if (empty($area)) {
            return response()->json([
                'message' => 'Payment Not Found',
                'status' => 'error'
            ]);
        }
         
        // $area->deleteFile();
        $delete  = $area->delete();

        if ($delete) {
            return response()->json([
                'message' => 'Payment successfully deleted',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
    }

     public function deleteAttachment(Request $request){

         $destroy = Payment::find($request['id']);

         if(Gate::denies('administrator') && !User::propertyBelongsToUser($destroy['property_id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 
          

        if (empty($destroy)) {
            return response()->json([
                'message' => 'Payment Not Found',
                'status' => 'error'
            ]);
        }
         
         $file = @end(explode('/', request()->file));

         $destroy->deleteFile($file);

        if ($destroy) {

            $media =  @$destroy->getMediaPathWithExtension()['file'] ? [@$destroy->getMediaPathWithExtension()] : @$destroy->getMediaPathWithExtension();
            $media= @collect($media)->all(); 
            return response()->json([
                'message' => 'File successfully deleted',
                'media' => $media,
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
    }

    public function download(Request $request, $view = false){
      
        $data = $this->getData($request);
        $items = @$data['data'];
        $grandTotal = @$data['grandTotal'];

        $pdf = PDF::loadView('pdf.payments',
          ['items' => $items,
          'grandTotal' => Payment::format($grandTotal)]
        );


        if ($request['tenant'] != '') {
            $tenant = $request['tenant'];
            $tenant = Tenant::find($tenant);
            $slug = @$tenant->slug;
        } 

        if ($request['work_type'] != '') {
            $work_type = $request['work_type'];
            $work_type = WorkType::find($work_type);
            $slug = @$work_type->slug;
        } 
         
         if ($request['property_type'] != '') {

            $property_type = $request['property_type'];
            $property_type = PropertyType::find($property_type);
            $slug = @$property_type->slug;
        }
         

        if ($request['property'] != '') {
            $property = $request['property'];
            $property = Property::find($property);
            $slug = \Str::slug(@$property->name);
        }

        if ($request['area'] != '') {
            $area = $request['area'];
            $area = Area::find($area);
            $slug = \Str::slug(@$area->name);
        }
         
         
        if ($request['sub_area'] != '') {
            $sub_area = $request['sub_area'];
            $sub_area = SubArea::find($sub_area);
            $slug = \Str::slug(@$sub_area->name);
        } 

       // return $pdf->stream('all_payment_s.pdf');
         $slug = (  @$slug ) ? $slug : 'all';

       if($view){
         $pdffile = $pdf->setPaper('a4')->output();
         $slug = $slug.'_payments_'.date('m-d-Y').'.pdf';
         return [$slug,$pdffile];
        }
      
        return $pdf->download($slug.'_payments_'.date('m-d-Y').'.pdf');


    }

      public function sendMail(Request $request){

         set_time_limit(0);
          $data = [
            'heading' => '',
            'plans' => '',
            'file' => '',
            'subject' => $request->subject,
            'content' => $request->message,
          ];
         
          list($fileName,$pdffile)  =  @$this->download($request,true);

          $ccUsers = ($request->filled('cc')) ? explode(',',$request->cc) : [];
          $bccUsers = ($request->filled('cc')) ? explode(',',$request->bcc) : [];

          $data['pdffile'] = $pdffile;
          $data['fileName'] = $fileName;

          dispatch(
             function() use ($request, $data, $ccUsers, $bccUsers){
             $mail = \Mail::to($request->recipient);
               if(array_filter($ccUsers)  &&  count($ccUsers) > 0){
                $mail->cc($ccUsers);
               }
               if(array_filter($bccUsers)  && count($bccUsers) > 0){
                $mail->bcc($bccUsers);
               }
               $mail->send(new MaitTo($data));
            }

          )->afterResponse();

          $recipient = $request->recipient;

          Mail::insert(
            ['email' => $recipient, 'to_type' => Mail::RC ], ['email' => $recipient, 
            'to_type' => Mail::RC]
          );
          
          $ccs = ($request->cc)  ? explode(',', $request->cc) : [];

          foreach ($ccs as $key => $cc) {
             Mail::UpdateOrCreate(
                ['email' => $cc, 'to_type' => Mail::CC],
                ['email' => $cc, 'to_type' => Mail::CC ]
              );
          }
          
          $bccs = ($request->bcc)  ? explode(',', $request->bcc) : [];

          foreach ($bccs as $key => $bcc) {
             Mail::UpdateOrCreate(
                ['email' => $bcc, 'to_type' => Mail::BCC],
                ['email' => $bcc, 'to_type' => Mail::BCC ]
              );
          }

        return response()->json(
             [
              'status' => 'success',
              'message' => 'Sent Successfully!'
             ]
         );

      } 

    public function trashed(Request $request)
    {
          if(Gate::denies('view')) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];

        $data = Payment::orderBy($sortBy, $sortType);

        if ($request['query'] != '') {
            $data->where('name', 'like', '%' . $request['query'] . '%');
        }
         
        $data = $data->onlyTrashed()->paginate($perPage);

        return response()->json([
            'message' => $data,
            'status' => 'success'
        ]);
    }
    

    public function restore(Request $request)
    {
         if(Gate::denies('delete')) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        }
        $restore = Payment::withTrashed()->where('id',$request['id'])->first();
          
        if (empty($restore)) {
            return response()->json([
                'message' => 'Payment Not Found',
                'status' => 'error'
            ]);
        }
         
        $restored  = $restore->restore();

        if ($restored) {
            return response()->json([
                'message' => 'Payment successfully restored',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
    }


}
