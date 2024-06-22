<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\DocumentType;
use App\Models\SubArea;
use App\Models\Area;
use App\Models\User;
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
        if(Gate::denies('view')) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        } 

        $perPage = $request['per_page'];
        $sortBy = $request['sort_by'];
        $sortType = $request['sort_type'];

        $whereUserProperties = User::userProperties();
        $data = SubArea::when($whereUserProperties, function ($q) use 
               ($whereUserProperties) {
                $q->whereIn('property_id', $whereUserProperties);
              })->orderBy($sortBy, $sortType);

        if ($request['query'] != '') {
            $data->where('name', 'like', '%' . $request['query'] . '%');
        }
         
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
          $areas = Area::where('property_id',$request->property)
                        ->whereNotNull('property_id')
                       ->orderBy('name')->get();
         if($areas){
            $areas = @$areas->filter(function($area){
              $area->label = $area->name;
              $area->value = $area->id;
              return $area;
          });
         }

         $area = ($areas) ?  $areas : [];  
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
        $data = $request->except('api_token');
        if(Gate::denies('administrator') && !User::propertyBelongsToUser($data['property_id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        }  
         
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

         if(Gate::denies('administrator') && !User::propertyBelongsToUser($data['property_id'])) {
             return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        }  
         
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

       $exitsWith = '';
       $withAsset = SubArea::has('asset')->whereId($request['id']);
       $withPayment = SubArea::has('payment')->whereId($request['id']);

       $exitsWith = @$withAsset->exists() ? 'Asset' : (@$withPayment->exists() ? 'Payment' : '');

       if (($exitsWith  && ($subArea->area_id != $data['area_id'])) || ($exitsWith  && ($subArea->property_id != $data['property_id']))) {
            return response()->json([
                'message' => "Sub Area have been used  in $exitsWith, So it's Property & Area cant be changed",
                'status' => 'error'
            ]);
        }

       if ($subArea) {
            $subArea->update($data);

            if($request->hasFile('photo') && $request->file('photo')->isValid()){
               $subArea->deleteFile();-
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
           
        $area = SubArea::where('id',$request['id'])->first();

        if (empty($area)) {
            return response()->json([
                'message' => 'Sub Area Not Found',
                'status' => 'error'
            ]);
        }
         
        //$area->deleteFile();
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
    
        $subArea = SubArea::where('id',$request['id'])->onlyTrashed()->first();
        if (empty($subArea)) {
            return response()->json([
                'message' => 'Sub Area Not Found',
                'status' => 'error'
            ]);
        }
        $delete  = $subArea->forceDelete();

        if ($delete) {
            return response()->json([
                'message' => 'Sub Area successfully  permanentaly deleted',
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

        $data = SubArea::orderBy($sortBy, $sortType);

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
        $restore = SubArea::withTrashed()->where('id',$request['id'])->first();
          
        if (empty($restore)) {
            return response()->json([
                'message' => 'Sub Area Not Found',
                'status' => 'error'
            ]);
        }
         
        $restored  = $restore->restore();

        if ($restored) {
            return response()->json([
                'message' => 'Sub Area successfully restored',
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
