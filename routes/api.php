<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth:api'], 'prefix' => 'v1'], function () {

     Route::get('/lead/list', 'Api\LeadController@listData');
     Route::post('/lead/create', 'Api\LeadController@create');
     Route::post('/lead/update', 'Api\LeadController@update');
     Route::post('/lead/destroy', 'Api\LeadController@destroy');

     Route::get('/dashboard-data', 'Api\HomeController@getData');

     Route::get('/roles', 'Api\RoleController@index');
     Route::post('/roles', 'Api\RoleController@store');
     Route::post('/roles/update', 'Api\RoleController@update');
     Route::post('/roles/destroy', 'Api\RoleController@destroy');


});
