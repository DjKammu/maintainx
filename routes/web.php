<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Auth Routes 
Route::group(['middleware' => ['guest', 'web']], function () {
    Route::get('/', 'AuthController@redirectToIndex');

    //react route
    Route::get('/login', 'AuthController@index')->name('Login');
    Route::get('/registration', 'AuthController@index')->name('Registration');

    Route::post('/login', 'AuthController@login');
    Route::post('/registration', 'AuthController@signup');
});

// Set Up Routes // 

Route::group(['middleware' => ['can:add_users']], function () {
    
    Route::get('/roles', 'RoleController@index')->name('roles.index');
    Route::get('/roles/create', 'RoleController@index')->name('roles.create');
    Route::get('/roles/{id}', 'RoleController@index')->name('roles.show');

    Route::get('/users', 'UserController@index')->name('users.index');
    Route::get('/users/create', 'UserController@index')->name('users.create');
    Route::get('/users/{id}', 'UserController@index')->name('users.show');
});

Route::group(['middleware' => ['auth']], function () {
    Route::get('/setup', 'SetupController@index')->name('setup.index');

    Route::get('/properties', 'SetupController@properties')->name('properties.index');
    Route::get('/properties/create', 'SetupController@properties')->name('properties.create');
    Route::get('/properties/{id}', 'SetupController@properties')->name('properties.show');

    Route::get('/order-statuses', 'SetupController@orderStatuses')->name('order-statuses.index');
    Route::get('/order-statuses/create', 'SetupController@orderStatuses')->name('order-statuses.create');
    Route::get('/order-statuses/{id}', 'SetupController@orderStatuses')->name('order-statuses.show');

    Route::get('/priorities', 'SetupController@priorities')->name('priorities.index');
    Route::get('/priorities/create', 'SetupController@priorities')->name('priorities.create');
    Route::get('/priorities/{id}', 'SetupController@priorities')->name('priorities.show');

    Route::get('/document-types', 'SetupController@documentTypes')->name('document-types.index');
    Route::get('/document-types/create', 'SetupController@documentTypes')->name('document-types.create');
    Route::get('/document-types/{id}', 'SetupController@documentTypes')->name('document-types.show');

    Route::get('/asset-types', 'SetupController@assetTypes')->name('asset-types.index');
    Route::get('/asset-types/create', 'SetupController@assetTypes')->name('asset-types.create');
    Route::get('/asset-types/{id}', 'SetupController@assetTypes')->name('asset-types.show');

    Route::get('/order-types', 'SetupController@orderTypes')->name('order-types.index');
    Route::get('/order-types/create', 'SetupController@orderTypes')->name('order-types.create');
    Route::get('/order-types/{id}', 'SetupController@orderTypes')->name('order-types.show');

    Route::get('/asset-works', 'SetupController@assetWorks')->name('asset-works.index');
    Route::get('/asset-works/create', 'SetupController@assetWorks')->name('asset-works.create');
    Route::get('/asset-works/{id}', 'SetupController@assetWorks')->name('asset-works.show'); 

    Route::get('/areas', 'SetupController@areas')->name('areas.index');
    Route::get('/areas/create', 'SetupController@areas')->name('areas.create');
    Route::get('/areas/{id}', 'SetupController@areas')->name('areas.show');

    Route::get('/contractors', 'SetupController@contractors')->name('contractors.index');
    Route::get('/contractors/create', 'SetupController@contractors')->name('contractors.create');
    Route::get('/contractors/{id}', 'SetupController@contractors')->name('contractors.show');

    Route::get('/vendors', 'SetupController@vendors')->name('vendors.index');
    Route::get('/vendors/create', 'SetupController@vendors')->name('vendors.create');
    Route::get('/vendors/{id}', 'SetupController@vendors')->name('vendors.show');

    Route::get('/sub-areas', 'SetupController@subAreas')->name('sub-areas.index');
    Route::get('/sub-areas/create', 'SetupController@subAreas')->name('sub-areas.create');
    Route::get('/sub-areas/{id}', 'SetupController@subAreas')->name('sub-areas.show');

    Route::get('/asset', 'SetupController@assets')->name('assets.index');
    Route::get('/asset/create', 'SetupController@assets')->name('assets.create');
    Route::get('/asset/{id}', 'SetupController@assets')->name('assets.show');

    Route::get('/property-types', 'SetupController@propertyTypes')->name('property-types.index');
    Route::get('/property-types/create', 'SetupController@propertyTypes')->name('property-types.create');
    Route::get('/property-types/{id}', 'SetupController@propertyTypes')->name('property-types.show'); 

    Route::get('/asset-model', 'SetupController@assetModel')->name('asset-model.index');
    Route::get('/asset-model/create', 'SetupController@assetModel')->name('asset-model.create');
    Route::get('/asset-model/{id}', 'SetupController@assetModel')->name('asset-model.show');

    Route::get('/tenants', 'SetupController@tenants')->name('tenants.index');
    Route::get('/tenants/create', 'SetupController@tenants')->name('tenants.create');
    Route::get('/tenants/{id}', 'SetupController@tenants')->name('tenants.show');   

    Route::get('/work-types', 'SetupController@workTypes')->name('work-types.index');
    Route::get('/work-types/create', 'SetupController@workTypes')->name('work-types.create');
    Route::get('/work-types/{id}', 'SetupController@workTypes')->name('work-types.show');

});



// Dashborad Roues 

Route::group(['middleware' => ['auth']], function () {
    Route::get('/logout', 'HomeController@logout')->name('Logout');
    Route::get('/home', 'HomeController@index')->name('Dashboard');

    Route::get('/payments', 'HomeController@payments')->name('payments.index');
    Route::get('/payments/create', 'HomeController@payments')->name('payments.create');
    Route::get('/payments/{id}', 'HomeController@payments')->name('payments.show');

});



// Migration Routes

Route::get('/clearapp', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Session::flush();
    return redirect('/');
});

Route::get('/linkstorage', function () {
    Artisan::call('storage:link');
    $exitCode = Artisan::call('storage:link', [] );
    echo $exitCode;
});

Route::get('/migration', function () {
    $m = request()->m;
    Artisan::call('migrate'.$m);
    $exitCode = Artisan::call('migrate', [] );
    echo $exitCode;
});