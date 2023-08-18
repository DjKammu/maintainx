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

        $data = SubArea::orderBy($sortBy, $sortType);

        if ($request['query'] != '') {
            $data->where('name', 'like', '%' . $request['query'] . '%');
        }
         
        $data = $data->paginate($perPage);

        $data->data = @collect($data->items())->filter(function($subArea){
                 $subArea->property_name = $subArea->property->name; 
                 if(@$subArea->property ){
                    @$subArea->property->label = $subArea->property->name;
                    @$subArea->property->value = $subArea->property->id;
                 }

                 $subArea->area_name = $subArea->area->name; 
                 if(@$subArea->area ){
                    @$subArea->area->label = $subArea->area->name;
                    @$subArea->area->value = $subArea->area->id;
                 }

              $media =  @$subArea->getMediaPathWithExtension()['file'] ? [@$subArea->getMediaPathWithExtension()] : @$subArea->getMediaPathWithExtension();
              $subArea->photo = @collect($media)->where('name')->first(); 
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
         $assetModels = AssetModel::orderBy('name')->get();
         $assetModels = @$assetModels->filter(function($assetModel){
              $assetModel->label = $assetModel->name;
              $assetModel->value = $assetModel->id;
              return $assetModel;
          });
         $vendors = Vendor::orderBy('name')->get();
         $vendors = @$vendors->filter(function($vendor){
              $vendor->label = $vendor->name;
              $vendor->value = $vendor->id;
              return $vendor;
          }); 
         $contractors = Contractor::orderBy('name')->get();
         $contractors = @$contractors->filter(function($contractor){
              $contractor->label = $contractor->name;
              $contractor->value = $contractor->id;
              return $contractor;
          });

         $tenants = Tenant::orderBy('name')->get();
         $tenants = @$tenants->filter(function($tenant){
              $tenant->label = $tenant->name;
              $tenant->value = $tenant->id;
              return $tenant;
          }); 
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
              'name' => 'required|string'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

       $subArea =  SubArea::create($data); 

       if ($subArea) {

           if($request->hasFile('photo') && $request->file('photo')->isValid()){
                $subArea->toPath(SubArea::AREA_LAYOUT_ATTACHMENTS)
                ->docType(DocumentType::AREA)
                ->storeFile('photo');
            }
         
            return response()->json([
                'message' => 'Sub Area successfully saved',
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
        $data = $request->except(['api_token','photo','id']   );
  
        $validate = Validator::make($request->all(),[
              'name' => 'required|string'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

       $subArea =  SubArea::find($request['id']);

       if ($subArea) {
            $subArea->update($data);

            if($request->hasFile('photo') && $request->file('photo')->isValid()){
               $subArea->deleteFile();-
                $subArea->toPath(SubArea::AREA_LAYOUT_ATTACHMENTS)
                ->docType(DocumentType::AREA)
                ->storeFile('photo');
            }

            return response()->json([
                'message' => 'Area successfully saved',
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
        $area = SubArea::where('id',$request['id'])->first();
                  
        if (empty($area)) {
            return response()->json([
                'message' => 'Sub Area Not Found',
                'status' => 'error'
            ]);
        }
         
        $area->deleteFile();
        $delete  = $area->delete();

        if ($delete) {
            return response()->json([
                'message' => 'Sub Area successfully deleted',
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
