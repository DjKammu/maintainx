<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Gate;

class SetupController extends Controller
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
    
     public function index(){

        return view('setup.index');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function properties()
    {
         if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.properties');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function orderStatuses()
    {
       if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.order-statuses');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function priorities(Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.priorities');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function assetTypes (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.asset-types');

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function orderTypes (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.order-types');

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function assetWorks (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.asset-works');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function documentTypes (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.document-types');

    }


    public function areas (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.areas');

    }


    public function subAreas (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.sub-areas');

    }

    public function vendors (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.vendors');

    }  


    public function contractors (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.contractors');

    } 

    public function assets (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.assets');

    }


    public function propertyTypes (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.property-types');

    }

    public function assetModel (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.asset-model');

    }

    public function tenants (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.tenants');

    }

    public function workTypes (Request $request)
    {
        if(Gate::denies('view')) {
               return abort('401');
         }
         return view('setup.work-types');

    }
}
