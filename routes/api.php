<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth:api'], 'prefix' => 'v1'], function () {
     Route::get('/dashboard-data', 'Api\HomeController@getData');

     Route::get('/properties', 'Api\PropertyController@index');
     Route::post('/properties', 'Api\PropertyController@store');
     Route::get('/properties/property-types', 'Api\PropertyController@propertyTypes');
     Route::post('/properties/update', 'Api\PropertyController@update');
     Route::post('/properties/destroy', 'Api\PropertyController@destroy');
     Route::get('/properties/trashed', 'Api\PropertyController@trashed'); 
     Route::post('/properties/restore', 'Api\PropertyController@restore');

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
     Route::get('/asset-types/trashed', 'Api\AssetTypeController@trashed'); 
     Route::post('/asset-types/restore', 'Api\AssetTypeController@restore');



     Route::get('/order-types', 'Api\OrderTypeController@index');
     Route::post('/order-types', 'Api\OrderTypeController@store');
     Route::post('/order-types/update', 'Api\OrderTypeController@update');
     Route::post('/order-types/destroy', 'Api\OrderTypeController@destroy');
     
     Route::get('/asset-works', 'Api\AssetWorkController@index');
     Route::post('/asset-works', 'Api\AssetWorkController@store');
     Route::post('/asset-works/update', 'Api\AssetWorkController@update');
     Route::post('/asset-works/destroy', 'Api\AssetWorkController@destroy');

     Route::get('/areas', 'Api\AreaController@index');
     Route::post('/areas', 'Api\AreaController@store');
     Route::get('/areas/properties', 'Api\AreaController@properties');
     Route::post('/areas/update', 'Api\AreaController@update');
     Route::post('/areas/destroy', 'Api\AreaController@destroy');
     Route::get('/areas/trashed', 'Api\AreaController@trashed'); 
     Route::post('/areas/restore', 'Api\AreaController@restore');

     Route::get('/sub-areas', 'Api\SubAreaController@index');
     Route::post('/sub-areas', 'Api\SubAreaController@store');
     Route::get('/sub-areas/areas', 'Api\SubAreaController@areas');
     Route::post('/sub-areas/update', 'Api\SubAreaController@update');
     Route::post('/sub-areas/destroy', 'Api\SubAreaController@destroy');
     Route::get('/sub-areas/trashed', 'Api\SubAreaController@trashed'); 
     Route::post('/sub-areas/restore', 'Api\SubAreaController@restore');

     Route::get('/vendors', 'Api\VendorController@index');
     Route::post('/vendors', 'Api\VendorController@store');
     Route::post('/vendors/update', 'Api\VendorController@update');
     Route::post('/vendors/destroy', 'Api\VendorController@destroy');
     Route::get('/vendors/trashed', 'Api\VendorController@trashed'); 
     Route::post('/vendors/restore', 'Api\VendorController@restore');

     Route::get('/contractors', 'Api\ContractorController@index');
     Route::post('/contractors', 'Api\ContractorController@store');
     Route::post('/contractors/update', 'Api\ContractorController@update');
     Route::post('/contractors/destroy', 'Api\ContractorController@destroy'); 
     Route::get('/contractors/trashed', 'Api\ContractorController@trashed'); 
     Route::post('/contractors/restore', 'Api\ContractorController@restore');

     Route::get('/asset', 'Api\AssetController@index');
     Route::post('/asset', 'Api\AssetController@store');
     Route::post('/asset/update', 'Api\AssetController@update');
     Route::post('/asset/destroy', 'Api\AssetController@destroy');  
     Route::get('/asset/trashed', 'Api\AssetController@trashed'); 
     Route::post('/asset/restore', 'Api\AssetController@restore');


     Route::get('/property-types', 'Api\PropertyTypeController@index');
     Route::post('/property-types', 'Api\PropertyTypeController@store');
     Route::post('/property-types/update', 'Api\PropertyTypeController@update');
     Route::post('/property-types/destroy', 'Api\PropertyTypeController@destroy'); 
     Route::get('/property-types/trashed', 'Api\PropertyTypeController@trashed'); 
     Route::post('/property-types/restore', 'Api\PropertyTypeController@restore');

     Route::get('/asset-model', 'Api\AssetModelController@index');
     Route::get('/asset-model/asset-types', 'Api\AssetModelController@assetTypes');
     Route::post('/asset-model/delete-attachment', 'Api\AssetModelController@deleteAttachment');
     Route::post('/asset-model', 'Api\AssetModelController@store');
     Route::post('/asset-model/update', 'Api\AssetModelController@update');
     Route::post('/asset-model/destroy', 'Api\AssetModelController@destroy');

     Route::get('/tenants', 'Api\TenantController@index');
     Route::post('/tenants', 'Api\TenantController@store');
     Route::get('/tenants/sub-area', 'Api\TenantController@subArea');
     Route::post('/tenants/update', 'Api\TenantController@update');
     Route::post('/tenants/destroy', 'Api\TenantController@destroy');
     Route::get('/tenants/trashed', 'Api\TenantController@trashed'); 
     Route::post('/tenants/restore', 'Api\TenantController@restore');

     Route::get('/work-types', 'Api\WorkTypeController@index');
     Route::post('/work-types', 'Api\WorkTypeController@store');
     Route::post('/work-types/update', 'Api\WorkTypeController@update');
     Route::post('/work-types/destroy', 'Api\WorkTypeController@destroy'); 
     Route::get('/work-types/trashed', 'Api\WorkTypeController@trashed'); 
     Route::post('/work-types/restore', 'Api\WorkTypeController@restore');


     Route::get('/payments', 'Api\PaymentController@index');
     Route::get('/payments/attributes', 'Api\PaymentController@attributes');
     Route::get('/payments/asset-selection', 'Api\PaymentController@assetSelection');
     Route::post('/payments/delete-attachment', 'Api\PaymentController@deleteAttachment');
     Route::get('/payments/assets', 'Api\PaymentController@assets');
     Route::get('/payments/property', 'Api\PaymentController@property');
     Route::get('/payments/area', 'Api\PaymentController@area');
     Route::get('/payments/sub-area', 'Api\PaymentController@subArea');
     Route::get('/payments/tenant', 'Api\PaymentController@tenant');
     Route::post('/payments', 'Api\PaymentController@store');
     Route::post('/payments/update', 'Api\PaymentController@update');
     Route::post('/payments/destroy', 'Api\PaymentController@destroy');
     Route::get('/payments/download', 'Api\PaymentController@download');
     Route::post('/payments/mail', 'Api\PaymentController@sendMail');
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

});
