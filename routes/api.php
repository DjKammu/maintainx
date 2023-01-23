<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth:api'], 'prefix' => 'v1'], function () {

     Route::get('/lead/list', 'Api\LeadController@listData');
     Route::post('/lead/create', 'Api\LeadController@create');
     Route::post('/lead/update', 'Api\LeadController@update');
     Route::post('/lead/destroy', 'Api\LeadController@destroy');

     Route::get('/dashboard-data', 'Api\HomeController@getData');
});


Route::group(['middleware' => ['auth:api','can:add_users'], 'prefix' => 'v1'], function () {

     Route::get('/roles', 'Api\RoleController@index');
     Route::post('/roles', 'Api\RoleController@store');
     Route::post('/roles/update', 'Api\RoleController@update');
     Route::post('/roles/destroy', 'Api\RoleController@destroy');

     Route::get('/users', 'Api\UserController@index');
     Route::get('/users/create', 'Api\UserController@create');
     Route::post('/users', 'Api\UserController@store');
     Route::post('/users/update', 'Api\UserController@update');
     Route::post('/users/destroy', 'Api\UserController@destroy');

     Route::get('/properties', 'Api\PropertyController@index');
     Route::post('/properties', 'Api\PropertyController@store');
     Route::post('/properties/update', 'Api\PropertyController@update');
     Route::post('/properties/destroy', 'Api\PropertyController@destroy');

});
