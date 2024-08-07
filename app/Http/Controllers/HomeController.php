<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Auth;
use Illuminate\Http\Request;
use Redirect;
use Faker\Provider\Lorem;
use Gate;

class HomeController extends Controller
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

    public function index(Request $request)
    {
        return view('user.dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return redirect(route('Login'));
    }

     public function payments(){
        
        if(Gate::denies('view')) {
               return abort('401');
         }

        return view('payments');
    } 

    public function documents(){
        
        if(Gate::denies('view')) {
               return abort('401');
         }

        return view('documents');
    }

}
