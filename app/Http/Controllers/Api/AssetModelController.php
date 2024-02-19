<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\DocumentType;
use App\Models\AssetModel;
use App\Models\AssetType;
use App\Models\User;
use App\Models\Role;
use Gate;
use Validator;

class AssetModelController extends Controller
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
        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];

        $whereUserProperties = User::userProperties();

        $data = AssetModel::when($whereUserProperties, function ($q) use 
               ($whereUserProperties) {
                $q->whereIn('property_id', $whereUserProperties);
              })->orderBy($sortBy, $sortType);

        if ($request['query'] != '') {
            $data->where('name', 'like', '%' . $request['query'] . '%');
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

         
        $data = $data->paginate($perPage);

        $data->data = @collect($data->items())->filter(function($asset){
                 $asset->asset_type_name = $asset->asset_type->name; 
                 if(@$asset->asset_type ){
                    @$asset->asset_type->label = $asset->asset_type->name;
                    @$asset->asset_type->value = $asset->asset_type->id;
                 }

                 $asset->property_name = $asset->property->name; 
                 if(@$asset->property ){
                    @$asset->property->label = $asset->property->name;
                    @$asset->property->value = $asset->property->id;
                 }

                 $asset->property_type_name = $asset->property_type->name; 
                 if(@$asset->property_type ){
                    @$asset->property_type->label = $asset->property_type->name;
                    @$asset->property_type->value = $asset->property_type->id;
                 }

                 $asset->area_name = $asset->area->name; 
                 if(@$asset->area ){
                    @$asset->area->label = $asset->area->name;
                    @$asset->area->value = $asset->area->id;
                 }

                 $asset->sub_area_name = $asset->sub_area->name; 
                 if(@$asset->sub_area ){
                    @$asset->sub_area->label = $asset->sub_area->name;
                    @$asset->sub_area->value = $asset->sub_area->id;
                 }

                 $media =  @$asset->getMediaPathWithExtension()['file'] ? [@$asset->getMediaPathWithExtension()] : @$asset->getMediaPathWithExtension();
                 $asset->media = @collect($media)->all(); 

        });


        return response()->json([
            'message' => $data,
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
              'name' => 'required|string',
               // 'account_number' => 'required|unique:asset_models',
        ],[
            'account_number.required'=> 'Model Number is Required!',
            'account_number.unique'=> 'Model Number must be unique!',
           ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
       
        $data['slug'] = \Str::slug($request->name);
        $create =  AssetModel::create($data); 

         if($request->hasFile('files')){
                $create->toPath(AssetModel::ASSET_ATTACHMENTS)
                        ->docType(DocumentType::ASSET)->storeFile('files',true);
        }
        
       if ($create) {
         
            return response()->json([
                'message' => 'Asset Model successfully saved',
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
        $data = $request->except(['api_token','id']   );

        if(Gate::denies('administrator') && !User::propertyBelongsToUser($data['property_id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        }  
  
        $validate = Validator::make($request->all(),[
              'name' => 'required|string',
              // 'account_number' => 'required|unique:asset_models,account_number,'.$request['id'],
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
         
         $update =  AssetModel::find($request['id']);
         $data['slug'] = \Str::slug($request->name);

        $withAsset = AssetModel::has('payment')->whereId($request['id']);

        if ((@$withAsset->exists()  && ($update->asset_type_id != $data['asset_type_id'])) ||(@$withAsset->exists()  && ($update->area_id != $data['area_id'])) || (@$withAsset->exists()   && ($update->property_id != $data['property_id'])) || (@$withAsset->exists()   && ($update->property_type_id != $data['property_type_id'])) ) {
            return response()->json([
                'message' => "Asset have been used  in Payment , So it's Property Type, Property, Area & Sub Area cant be changed",
                'status' => 'error'
            ]);
        }

       if ($update) {
            $update->update($data);

            if($request->hasFile('files')){
                    //$update=>deleteFile();
                    $update->toPath(AssetModel::ASSET_ATTACHMENTS)
                            ->docType(DocumentType::ASSET)->storeFile('files',true);
            }

            return response()->json([
                'message' => 'Asset Model successfully saved',
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

        if(Gate::denies('administrator') && !User::propertyBelongsToUser($destroy['property_id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 

        $password = $request->password;
        $user = \Auth::user();

        if(!\Hash::check($password, $user->password)) { 
          return response()->json(
               [
                'status' => 'error',
                'message' => 'Password not matched!'
               ]
            );
        }
                  
        $destroy = AssetModel::where('id',$request['id'])->first();
        if (empty($destroy)) {
            return response()->json([
                'message' => 'Asset Model Not Found',
                'status' => 'error'
            ]);
        }
         
        // $destroy->deleteFile();

        $delete  = $destroy->delete();

        if ($delete) {
            return response()->json([
                'message' => 'Asset Model successfully deleted',
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

         $destroy = AssetModel::find($request['id']);

        if(Gate::denies('administrator') && !User::propertyBelongsToUser($destroy['property_id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 

        if (empty($destroy)) {
            return response()->json([
                'message' => 'Asset Model Not Found',
                'status' => 'error'
            ]);
        }
         
         $file = @end(explode('/', request()->file));

         $destroy->deleteFile($file);

        if ($destroy) {

            $media =  @$destroy->getMediaPathWithExtension()['file'] ? [@$destroy->getMediaPathWithExtension()] : @$destroy->getMediaPathWithExtension();
            $media= @collect($media)->all(); 
            return response()->json([
                'message' => 'Asset Model Attachment successfully deleted',
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


    public function assetTypes()
    {
          
          $assetTypes = AssetType::orderBy('name')->get();
          $assetTypes = @$assetTypes->filter(function($assetType){
              $assetType->label = $assetType->name;
              $assetType->value = $assetType->id;
              return $assetType;
          });

          return response()->json([
            'message' => compact('assetTypes'),
            'status' => 'success'        
        ]);

    }

        public function trashed(Request $request)
    {
          if(Gate::denies('view')) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];

        $data = AssetModel::orderBy($sortBy, $sortType);

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
        $restore = AssetModel::withTrashed()->where('id',$request['id'])->first();
          
        if (empty($restore)) {
            return response()->json([
                'message' => 'Asset Model Not Found',
                'status' => 'error'
            ]);
        }
         
        $restored  = $restore->restore();

        if ($restored) {
            return response()->json([
                'message' => 'Asset Model successfully restored',
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
