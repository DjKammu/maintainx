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

     Route::get('/order-statuses', 'Api\OrderStatusController@index');
     Route::post('/order-statuses', 'Api\OrderStatusController@store');
     Route::post('/order-statuses/update', 'Api\OrderStatusController@update');
     Route::post('/order-statuses/destroy', 'Api\OrderStatusController@destroy');

     Route::get('/priorities', 'Api\PriorityController@index');
     Route::post('/priorities', 'Api\PriorityController@store');
     Route::post('/priorities/update', 'Api\PriorityController@update');
     Route::post('/priorities/destroy', 'Api\PriorityController@destroy'); 

     Route::get('/document-types', 'Api\DocumentTypeController@index');
     Route::post('/document-types', 'Api\DocumentTypeController@store');
     Route::post('/document-types/update', 'Api\DocumentTypeController@update');
     Route::post('/document-types/destroy', 'Api\DocumentTypeController@destroy');

     Route::get('/asset-types', 'Api\AssetTypeController@index');
     Route::post('/asset-types', 'Api\AssetTypeController@store');
     Route::post('/asset-types/update', 'Api\AssetTypeController@update');
     Route::post('/asset-types/destroy', 'Api\AssetTypeController@destroy');

     Route::get('/order-types', 'Api\OrderTypeController@index');
     Route::post('/order-types', 'Api\OrderTypeController@store');
     Route::post('/order-types/update', 'Api\OrderTypeController@update');
     Route::post('/order-types/destroy', 'Api\OrderTypeController@destroy');
     
     Route::get('/asset-works', 'Api\AssetWorkController@index');
     Route::post('/asset-works', 'Api\AssetWorkController@store');
     Route::post('/asset-works/update', 'Api\AssetWorkController@update');
     Route::post('/asset-works/destroy', 'Api\AssetWorkController@destroy');

});
