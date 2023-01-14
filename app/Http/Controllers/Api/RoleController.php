<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use Gate;
use Validator;

class RoleController extends Controller
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

        $roles = Role::orderBy($sortBy, $sortType);

        if ($request['query'] != '') {
            $roles->where('name', 'like', '%' . $request['query'] . '%');
        }
        
        return response()->json([
            'message' => $roles->paginate($perPage),
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
        // if(Gate::denies('add')) {
        //        return abort('401');
        // } 

          return Inertia::render('roles/Create');
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


    
        $validate = Validator::make($request->all(),[
              'name' => 'required',
              'permissions' => 'required',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
        
        $data = $request->except('api_token');


        $data['slug'] = \Str::slug($request->name);

        // $data['permissions'] = @implode(",",@array_filter($request->permissions));

        $role = Role::create($data);

       if ($role) {
            return response()->json([
                'message' => 'Role successfully saved',
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
         // if(Gate::denies('edit')) {
         //       return abort('401');
         //  } 

         $role = Role::find($id);
		 $role->permissionsArray = @array_filter(@explode(',', $role->permissions));
         return Inertia::render('roles/Edit',compact('role'));
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
    public function update(Request $request, $id)
    {    

        //  if(Gate::denies('update')) {
        //        return abort('401');
        // } 

        $data = $request->except('_token');

        $request->validate([
              'name' => 'required',
               'permissions' => 'required|array',
        ]);

        $data['slug'] = \Str::slug($request->name);
        $data['permissions'] = @implode(",",$request->permissions);

         $role = Role::find($id);

         if(!$role){
            return redirect()->back();
         }
          
        $role->update($data);
          
        return redirect('roles')->with('message', 'Role Updated Successfully!');
    }


    public function destroy(Request $request)
    {
         $role = Role::where('id',$request['id'])->first();
                  
        if (empty($role)) {
            return response()->json([
                'message' => 'Role Not Found',
                'status' => 'error'
            ]);
        }

        $delete  = $role->delete();

        if ($delete) {
            return response()->json([
                'message' => 'Role successfully deleted',
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
