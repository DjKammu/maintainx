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
use Gate;
use Validator;

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
        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];

        $data = Payment::query();

        if ($sortBy && $sortType) {
            $data->orderBy($sortBy, $sortType);
        }

        if ($request['query'] != '') {
            $data->where('name', 'like', '%' . $request['query'] . '%');
        }
        
        if ($request['id'] != '') {
            $data->where('id',$request['id']);
        }
       
       

        if ($request['property_type'] != '') {

            $property_type = $request['property_type'];
            $data->whereHas('property_type', function($q) use ($property_type){
                $q->where('id', $property_type);
            });
        }

        if ($request['property'] != '') {
            $property = $request['property'];
            $data->whereHas('property', function($q) use ($property){
                $q->where('id', $property);
            });
        }

          if ($request['area'] != '') {
            $area = $request['area'];
            $data->whereHas('area', function($q) use ($area){
                $q->where('id', $area);
            });
        }
         
         
        if ($request['sub_area'] != '') {
            $sub_area = $request['sub_area'];
            $data->whereHas('sub_area', function($q) use ($sub_area){
                $q->where('id', $sub_area);
            });
        } 


        $data = $data->paginate($perPage);

        $data->data = @collect($data->items())->filter(function($payment){
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

                 $payment->vendor_name = (@$payment->vendor->company_name) ? ( @$payment->vendor->company_name .'-'. @$payment->vendor->name ) : @$payment->vendor->name;
                 if(@$payment->vendor ){
                    @$payment->vendor->label = (@$payment->vendor->company_name) ? ( @$payment->vendor->company_name .'-'. @$payment->vendor->name ) : @$payment->vendor->name;
                    @$payment->vendor->value = $payment->vendor->id;
                 }

                 $payment->contractor_name = (@$payment->contractor->company_name) ? ( @$payment->contractor->company_name .'-'. @$payment->contractor->name ) : @$payment->contractor->name;
                 if(@$payment->contractor ){
                    @$payment->contractor->label = (@$payment->contractor->company_name) ? ( @$payment->contractor->company_name .'-'. @$payment->contractor->name ) : @$payment->contractor->name;
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



        return response()->json([
            'message' => $data,
            'status' => 'success'
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function areas(Request $request)
    { 
          $area = Area::where('property_id',$request->property)
                        ->whereNotNull('property_id')
                       ->orderBy('name')->first();
          if($area){
            $area->label = @$area->name;
            $area->value = @$area->id;
          }
           $area = ($area) ?  [$area] : []; 
         return response()->json([
            'message' => compact('area'),
            'status' => 'success'
        ]);
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
             ])->orderBy('name')->get();

            if($tenants){

                $tenants = @$tenants->filter(function($tenant){
                    $tenant->label = $tenant->name;
                    $tenant->value = $tenant->id;
                    return $tenant;
                });
            }

           }
          
         $tenants = ($tenants) ? $tenants : [];  

         return response()->json([
            'message' => compact('asset','tenants'),
            'status' => 'success'
        ]);
    }  

    public function assets(Request $request)
    { 
          $assets = AssetModel::where('asset_type_id',$request->asset_type)
                       ->orderBy('name')->get();

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
          $properties = Property::where('property_type_id',$request->property_type)
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

    public function area(Request $request)
    { 
          $areas = Area::where('property_id',$request->property)
                       ->whereNotNull('property_id')
                       ->orderBy('name')->get();
            
         if($areas){
            $areas = @$areas->filter(function($ar){
                $ar->label = $ar->name;
                $ar->value = $ar->id;
                return $ar;
            });
          }
         $area = ($areas) ? $areas : [];  
         
         return response()->json([
            'message' => compact('area'),
            'status' => 'success'
        ]);
    }
 

 public function subArea(Request $request)
    { 
          $subareas = SubArea::where('area_id',$request->area)
                       ->whereNotNull('area_id')
                       ->orderBy('name')->get();
            
         if($subareas){
            $subareas = @$subareas->filter(function($sa){
                $sa->label = $sa->name;
                $sa->value = $sa->id;
                return $sa;
            });
          }
         $sub_area = ($subareas) ? $subareas : [];  
         
         return response()->json([
            'message' => compact('sub_area'),
            'status' => 'success'
        ]);
    }

    public function assetType(Request $request)
    { 
          $properties = Property::where('property_type_id',$request->property_type)
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


        if ($payment['asset_type_id'] != '') {
            $assetModels->where('asset_type_id',$payment['asset_type_id']);
        }
       
        $assetModels = $assetModels->orderBy('name')->get();
       
       $assetModels = @$assetModels->filter(function($assetModel){
              $assetModel->label = $assetModel->name;
              $assetModel->value = $assetModel->id;
              return $assetModel;
          });
         $vendors = Vendor::orderBy('name')->get();
         $vendors = @$vendors->filter(function($vendor){
              $vendor->label = ($vendor->company_name) ? ( $vendor->company_name .'-'. $vendor->name ) : $vendor->name;
              $vendor->value = $vendor->id;
              return $vendor;
          }); 
         $contractors = Contractor::orderBy('name')->get();
         $contractors = @$contractors->filter(function($contractor){
              $contractor->label = ($contractor->company_name) ? ( $contractor->company_name .'-'. $contractor->name ) : $contractor->name;
              $contractor->value = $contractor->id;
              return $contractor;
          });

         $tenants = [];


        if($payment->tenant_id){
            
             $tenants = Tenant::where([
                         'id' => $payment->tenant_id
             ])->orderBy('name')->get();

            if($tenants){

                $tenants = @$tenants->filter(function($tenant){
                    $tenant->label = $tenant->name;
                    $tenant->value = $tenant->id;
                    return $tenant;
                });
            }

         }

         $workTypes = WorkType::orderBy('name')->get();
         $workTypes = @$workTypes->filter(function($workType){
              $workType->label = $workType->name;
              $workType->value = $workType->id;
              return $workType;
          });

          return response()->json([
            'message' => compact('propertyTypes','assetTypes','assetModels','vendors','contractors','tenants','workTypes'),
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
        if(Gate::denies('add')) {
               return abort('401');
        } 

        $data = $request->except('api_token');
  
         $validate = Validator::make($request->all(),[
              'asset_model_id' => 'required|string'
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
  
        $validate = Validator::make($request->all(),[
              'asset_model_id' => 'required|string'
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
        $area = Payment::where('id',$request['id'])->first();
                  
        if (empty($area)) {
            return response()->json([
                'message' => 'Payment Not Found',
                'status' => 'error'
            ]);
        }
         
        $area->deleteFile();
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

}
