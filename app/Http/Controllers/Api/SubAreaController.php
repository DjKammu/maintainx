<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\DocumentType;
use App\Models\SubArea;
use App\Models\Area;
use Gate;
use Validator;

class SubAreaController extends Controller
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
                       ->orderBy('name')->first();
          if($area){
            $area->label = @$area->name;
            $area->value = @$area->id;
          }
         $area = [$area];  
         return response()->json([
            'message' => compact('area'),
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
