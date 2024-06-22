<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\Vendor;
use App\Models\DocumentType;
use Gate;
use Validator;

class VendorController extends Controller
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

        $data = Vendor::orderBy($sortBy, $sortType);

        if ($request['query'] != '') {
            $data->where('name', 'like', '%' . $request['query'] . '%');
        }
         
        $data = $data->paginate($perPage);


        $data->data = @collect($data->items())->filter(function($vendor){
              $media =  @$vendor->getMediaPathWithExtension()['file'] ? [@$vendor->getMediaPathWithExtension()] : @$vendor->getMediaPathWithExtension();      
              $vendor->photo = @collect($media)->where('name')->first(); 
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
        if(Gate::denies('add')) {
               return abort('401');
        } 

        $data = $request->except('api_token');
  
        $validate = Validator::make($request->all(),[
              'name' => 'nullable|string'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }

         $contractor =  Vendor::create($data); 

       if ($contractor) {
         
            if($request->hasFile('photo') && $request->file('photo')->isValid()){
                $contractor->toPath(Vendor::VENDOR_ATTACHMENTS)
                ->docType(DocumentType::VENDOR)
                ->storeFile('photo');
            }
            
            return response()->json([
                'message' => 'Vendor successfully saved',
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
        $data = $request->except(['api_token','extra_attachment','layout_attachment','id']   );
  
        $validate = Validator::make($request->all(),[
              'name' => 'sometimes|nullable|string'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
         
         $contractor =  Vendor::find($request['id']);

       if ($contractor) {
            $contractor->update($data);
  
            if($request->hasFile('photo') && $request->file('photo')->isValid()){
                $contractor->deleteFile();
                $contractor->toPath(Vendor::VENDOR_ATTACHMENTS)
                ->docType(DocumentType::VENDOR)
                ->storeFile('photo');
            }
          
            return response()->json([
                'message' => 'Vendor successfully saved',
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
           

        $contractor = Vendor::where('id',$request['id'])->first();
                  
        if (empty($contractor)) {
            return response()->json([
                'message' => 'Vendor Not Found',
                'status' => 'error'
            ]);
        }
         
       // $contractor->deleteFile();
        $delete  = $contractor->delete();

        if ($delete) {
            return response()->json([
                'message' => 'Vendor successfully deleted',
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
    
        $vendor = Vendor::where('id',$request['id'])->onlyTrashed()->first();
        if (empty($vendor)) {
            return response()->json([
                'message' => 'Vendor Not Found',
                'status' => 'error'
            ]);
        }
        $delete  = $vendor->forceDelete();

        if ($delete) {
            return response()->json([
                'message' => 'Vendor successfully  permanentaly deleted',
                'status' => 'success'
            ]);
        } else {
            return response()->json([
                'message' => 'Something went wrong',
                'status' => 'error'
            ]);
        }
    }


     public function trashed(Request $request)
    {
          if(Gate::denies('view')) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];

        $data = Vendor::orderBy($sortBy, $sortType);

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
        $restore = Vendor::withTrashed()->where('id',$request['id'])->first();
          
        if (empty($restore)) {
            return response()->json([
                'message' => 'Vendor Not Found',
                'status' => 'error'
            ]);
        }
         
        $restored  = $restore->restore();

        if ($restored) {
            return response()->json([
                'message' => 'Vendor successfully restored',
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
