<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
// use App\Models\Property;
use App\Models\User;
use App\Models\Role;
use Gate;
use Validator;

class UserController extends Controller
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

        $users = User::orderBy($sortBy, $sortType);

        if ($request['query'] != '') {
            $roles->where('name', 'like', '%' . $request['query'] . '%');
        }
         
        $users = $users->paginate($perPage);

        $users->data = @collect($users->items())->filter(function($user){
             @$user->roles->filter(function($role){
                  $role->label = $role->name;
                  $role->value = $role->id;
                  return $role;
              });
        });

        return response()->json([
            'message' => $users,
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
      
        $data = $request->except('api_token');

        $validate = Validator::make($request->all(),[
              'name' => 'required|string',
               'email' => [
                    'required',
                    'string',
                    'email',
                    Rule::unique(User::class),
                ],
              'password' => ['required', 'string', 'password', 'confirmed']
        ]);
       

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
        
        $user =  User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

       if ($user) {
            $user->roles()->sync($data['role']); 
            // $user->properties()->sync($data['properties']); 

            return response()->json([
                'message' => 'User successfully saved',
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
        $data = $request->except(['api_token','password','password_confirmation']);
    
        $validate = Validator::make($request->all(),[
              'name' => 'required|max:255',
              'email' => 'required|email|max:255|unique:users,id,:id',
              'password' => 'nullable|sometimes|min:6|confirmed|required_with:password'
        ]);
       
        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
        
        ($request->filled('password')) ? $data['password'] = \Hash::make($request->password) 
        : '';

        $user = User::find($request['id']);

       if ($user) {
            $user->update($data);
            $user->roles()->sync($data['role']); 
            // $user->properties()->sync($data['properties']); 

            return response()->json([
                'message' => 'User successfully saved',
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
         $user = User::where('id',$request['id'])->first();
                  
        if (empty($user)) {
            return response()->json([
                'message' => 'User Not Found',
                'status' => 'error'
            ]);
        }

        $delete  = $user->delete();

        if ($delete) {
            return response()->json([
                'message' => 'User successfully deleted',
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
