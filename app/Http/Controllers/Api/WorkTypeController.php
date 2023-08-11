<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\WorkType;
use App\Models\User;
use App\Models\Role;
use Gate;
use Validator;

class WorkTypeController extends Controller
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

        $data = WorkType::orderBy($sortBy, $sortType);

        if ($request['query'] != '') {
            $data->where('name', 'like', '%' . $request['query'] . '%');
        }
         
        $data = $data->paginate($perPage);

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
              'name' => 'required|string',
            'account_number' => 'required|unique:work_types',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
        $data['slug'] = \Str::slug($request->name);
        $create =  WorkType::create($data); 

       if ($create) {
         
            return response()->json([
                'message' => 'Work Type successfully saved',
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
  
        $validate = Validator::make($request->all(),[
              'name' => 'required|string',
              'account_number' => 'required|unique:work_types,account_number,'.$request['id'],
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => $validate->errors(),
                'status' => 'validation-error'
            ], 401);
        }
         
         $update =  WorkType::find($request['id']);
         $data['slug'] = \Str::slug($request->name);

       if ($update) {
            $update->update($data);
    
            return response()->json([
                'message' => 'Work Type successfully saved',
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
        $destroy = PropertyType::where('id',$request['id'])->first();
                  
        if (empty($destroy)) {
            return response()->json([
                'message' => 'Work Type Not Found',
                'status' => 'error'
            ]);
        }
         
        $delete  = $destroy->delete();

        if ($delete) {
            return response()->json([
                'message' => 'Work Type successfully deleted',
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
