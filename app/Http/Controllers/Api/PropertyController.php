<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\PropertyType;
use App\Models\Property;
use App\Models\User;
use App\Models\Role;
use Gate;
use Validator;

class PropertyController extends Controller
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

        $whereUserProperties = User::userProperties();
        
        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];

        $properties = Property::when($whereUserProperties, function ($q) use 
               ($whereUserProperties) {
                $q->whereIn('id', $whereUserProperties);
              })->orderBy($sortBy, $sortType);

        if ($request['query'] != '') {
            $properties->where('name', 'like', '%' . $request['query'] . '%');
        }
         
        $properties = $properties->paginate($perPage);

        $properties->data = @collect($properties->items())->filter(function($property){
              $media =  @$property->getMediaPathWithExtension()['file'] ? [@$property->getMediaPathWithExtension()] : @$property->getMediaPathWithExtension();
              $property->layout_attachment = @collect($media)->where('name','layout_attachment')->first(); 
              $property->extra_attachment =  @collect($media)->where('name','extra_attachment')->first();

              $property->property_type_name = $property->property_type->name; 
             if(@$property->property_type ){
                @$property->property_type->label = $property->property_type->name;
                @$property->property_type->value = $property->property_type->id;
             } 

        });

        return response()->json([
            'message' => $properties,
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
          // $properties = Property::orderBy('name')->get();

          // $properties = @$properties->filter(function($property){
          //     $property->label = $property->name;
          //     $property->value = $property->id;
          //     return $property;
          // });
          $properties = [];
          $roles = Role::orderBy('name')->get();

          $roles = @$roles->filter(function($role){
              $role->label = $role->name;
              $role->value = $role->id;
              return $role;
          });

          return response()->json([
            'message' => compact('roles','properties'),
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
        // if(Gate::denies('add')) {
        //        return abort('401');
        // } 

        if(Gate::denies('administrator')) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
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

         $property =  Property::create($data); 

       if ($property) {
         
            if($request->hasFile('layout_attachment') && $request->file('layout_attachment')->isValid()){
               $request->merge(['layout_attachment_coulumn' => 'layout_attachment']); 
                $property->toPath(Property::LAYOUT_ATTACHMENTS)->storeFile('layout_attachment',false,'layout_attachment_coulumn');
            }
            if($request->hasFile('extra_attachment') && $request->file('extra_attachment')->isValid()){
               $request->merge(['extra_attachment_coulumn' => 'extra_attachment']); 
                $property->toPath(Property::LAYOUT_ATTACHMENTS)->storeFile('extra_attachment',false,'extra_attachment_coulumn');
            }

            return response()->json([
                'message' => 'Property successfully saved',
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
    
    public function propertyTypes()
    {
          
          $propertyTypes = PropertyType::orderBy('name')->get();
          $propertyTypes = @$propertyTypes->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });

          return response()->json([
            'message' => compact('propertyTypes'),
            'status' => 'success'
        ]);


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

        if(Gate::denies('administrator') && !User::propertyBelongsToUser($request['id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 

        $data = $request->except(['api_token','extra_attachment','layout_attachment','id']   );
  
        $validate = Validator::make($request->all(),[
              'name' => 'required|string'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
         
        $property =  Property::find($request['id']);

        if (empty($property)) {
            return response()->json([
                'message' => 'Property Not Found',
                'status' => 'error'
            ]);
        }

        $exists = Property::has('area')->whereId($request['id']);

        if (@$exists->exists()  && ($property->property_type_id != $data['property_type_id'])) {
            return response()->json([
                'message' => "Property have been used  in Area, So i'ts cant be changed",
                'status' => 'error'
            ]);
        }

       if ($property) {
            $property->update($data);
            if($request->hasFile('layout_attachment') && $request->file('layout_attachment')->isValid()){
               $property->deleteFile(['name' => 'layout_attachment']);
               $request->merge(['layout_attachment_coulumn' => 'layout_attachment']); 
                $property->toPath(Property::LAYOUT_ATTACHMENTS)->storeFile('layout_attachment',false,'layout_attachment_coulumn');
            }
            if($request->hasFile('extra_attachment') && $request->file('extra_attachment')->isValid()){
               $property->deleteFile(['name' => 'extra_attachment']);
               $request->merge(['extra_attachment_coulumn' => 'extra_attachment']); 
               $property->toPath(Property::LAYOUT_ATTACHMENTS)->storeFile('extra_attachment',false,'extra_attachment_coulumn');
            }
          
            return response()->json([
                'message' => 'Property successfully saved',
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
        if(Gate::denies('administrator') && !User::propertyBelongsToUser($request['id'])) {
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
        
        $property = Property::where('id',$request['id'])->first();
                  
        if (empty($property)) {
            return response()->json([
                'message' => 'Property Not Found',
                'status' => 'error'
            ]);
        }
         
        //$property->deleteFile();
        $delete  = $property->delete();

        if ($delete) {
            return response()->json([
                'message' => 'Property successfully deleted',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
    }

     public function forceDelete(Request $request)
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
    
        $property = Property::where('id',$request['id'])->onlyTrashed()->first();
        if (empty($property)) {
            return response()->json([
                'message' => 'Property Not Found',
                'status' => 'error'
            ]);
        }
        $property->deleteFile();
        $delete  = $property->forceDelete();

        if ($delete) {
            return response()->json([
                'message' => 'Property successfully  permanentaly deleted',
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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function trashed(Request $request)
    {
          if(Gate::denies('view')) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];

        $data = Property::orderBy($sortBy, $sortType);

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
        $restore = Property::withTrashed()->where('id',$request['id'])->first();
          
        if (empty($restore)) {
            return response()->json([
                'message' => 'Property Not Found',
                'status' => 'error'
            ]);
        }
         
        $restored  = $restore->restore();

        if ($restored) {
            return response()->json([
                'message' => 'Property successfully restored',
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
