<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\AssetModel;
use App\Models\SubArea;
use App\Models\Area;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Role;
use Gate;
use Validator;

class TenantController extends Controller
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

        $data = Tenant::when($whereUserProperties, function ($q) use 
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
              })->->when(!$sub_area, function ($q){
                      $q->orWhereNull('sub_area_id');
              });
        });

         
        $data = $data->paginate($perPage);

         $data->data = @collect($data->items())->filter(function($tenant){
                 $tenant->property_name = $tenant->property->name; 
                 if(@$tenant->property ){
                    @$tenant->property->label = $tenant->property->name;
                    @$tenant->property->value = $tenant->property->id;
                 }

                 $tenant->property_type_name = $tenant->property_type->name; 
                 if(@$tenant->property_type ){
                    @$tenant->property_type->label = $tenant->property_type->name;
                    @$tenant->property_type->value = $tenant->property_type->id;
                 }

                 $tenant->area_name = $tenant->area->name; 
                 if(@$tenant->area ){
                    @$tenant->area->label = $tenant->area->name;
                    @$tenant->area->value = $tenant->area->id;
                 }

                 $tenant->sub_area_name = $tenant->sub_area->name; 
                 if(@$tenant->sub_area ){
                    @$tenant->sub_area->label = $tenant->sub_area->name;
                    @$tenant->sub_area->value = $tenant->sub_area->id;
                 }

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
    public function create()
    {
          // 
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
              // 'account_number' => 'nullable|unique:tenants',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
        $data['slug'] = \Str::slug($request->name);
        $create =  Tenant::create($data); 

       if ($create) {
         
            return response()->json([
                'message' => 'Tenant successfully saved',
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
               // 'account_number' => 'nullable|unique:tenants,account_number,'.$request['id'],
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
         
         $update =  Tenant::find($request['id']);
         $data['slug'] = \Str::slug($request->name);

       if ($update) {
            $update->update($data);
    
            return response()->json([
                'message' => 'Tenant successfully saved',
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
           

        $destroy = Tenant::where('id',$request['id'])->first();
         
        if (empty($destroy)) {
            return response()->json([
                'message' => 'Tenant Not Found',
                'status' => 'error'
            ]);
        }
         
        $delete  = $destroy->delete();

        if ($delete) {
            return response()->json([
                'message' => 'Tenant successfully deleted',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
        
    }

    public function subArea(Request $request)
    { 
          $asset_type_id = $request->asset_type_id;
          $whereUserProperties = User::userProperties();

          $subAreas = SubArea::when($whereUserProperties, function ($q) use 
                       ($whereUserProperties) {
                        $q->whereIn('property_id', $whereUserProperties);
                      })->where('area_id',$request->area_id)
                        ->whereNotNull('area_id')
                        ->whereHas('property', function($q){
                        })->orderBy('name')->get();

          if($subAreas){
             $subAreas = @$subAreas->filter(function($subArea){
                  $subArea->label = $subArea->name;
                  $subArea->value = $subArea->id;
                  return $subArea;
              });
          }
           
           $area = Area::when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('property_id', $whereUserProperties);
                        })->where('id',$request->area_id)
                        ->whereHas('property', function($q){
                        })->first();

           if($area){

              $assets = AssetModel::where([
                         'area_id' => $area->id,
                         'property_id' => $area->property_id
             ])->when($whereUserProperties, function ($q) use 
                         ($whereUserProperties) {
                          $q->whereIn('property_id', $whereUserProperties);
              })->when($asset_type_id, function ($q) use 
               ($asset_type_id) {
                $q->where('asset_type_id', $asset_type_id);
              })->orderBy('name')->get();

            if($assets){

                $assets = @$assets->filter(function($asset){
                    $asset->label = $asset->name;
                    $asset->value = $asset->id;
                    return $asset;
                });
            }

          }

         $assets = (@$assets) ? $assets : [];  
         $subArea = ($subAreas) ?  $subAreas : []; 
         return response()->json([
            'message' => compact('subArea','assets'),
            'status' => 'successs'       
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

        $data = Tenant::orderBy($sortBy, $sortType);

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
        $restore = Tenant::withTrashed()->where('id',$request['id'])->first();
          
        if (empty($restore)) {
            return response()->json([
                'message' => 'Tenant Not Found',
                'status' => 'error'
            ]);
        }
         
        $restored  = $restore->restore();

        if ($restored) {
            return response()->json([
                'message' => 'Tenant successfully restored',
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
