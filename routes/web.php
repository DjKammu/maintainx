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

Route::get('/setup', [App\Http\Controllers\HomeController::class, 'setup'])
     ->name('setup');

Route::group(['middleware' => ['can:add_users']], function () {
    
    Route::get('/roles', 'RoleController@index')->name('roles.index');
    Route::get('/roles/create', 'RoleController@index')->name('roles.create');
    Route::get('/roles/{role}', 'RoleController@index')->name('roles.show');

    Route::get('/users', 'UserController@index')->name('users.index');
    Route::get('/users/create', 'UserController@index')->name('users.create');
    Route::get('/users/{role}', 'UserController@index')->name('users.show');
});

Route::group(['middleware' => ['auth']], function () {
    Route::get('/properties', 'PropertyController@index')->name('properties.index');
    Route::get('/properties/create', 'PropertyController@index')->name('properties.create');
    Route::get('/properties/{role}', 'PropertyController@index')->name('properties.show');
});

// Route::resource('properties', App\Http\Controllers\PropertyController::class);
// Route::post('properties/quick-add', [App\Http\Controllers\PropertyController::class,
//     'quickAdd'])->name('properties.quick-add'); 
// Route::resource('showing-status', App\Http\Controllers\ShowingStatusController::class);
// Route::resource('leasing-status', App\Http\Controllers\LeasingStatusController::class);
// Route::resource('suites', App\Http\Controllers\SuiteController::class);

// Route::get('get-suites', [App\Http\Controllers\SuiteController::class, 'getSuites'])->name('suites.properties');
// Route::resource('document-types', App\Http\Controllers\DocumentTypeController::class);
// Route::resource('tenant-uses', App\Http\Controllers\TenantUseController::class);
// Route::resource('tenants', App\Http\Controllers\TenantController::class);
// Route::resource('realtors', App\Http\Controllers\RealtorController::class);





// Dashborad Roues 

Route::group(['middleware' => ['auth']], function () {
    Route::get('/logout', 'HomeController@logout')->name('Logout');
    Route::get('/home', 'HomeController@index')->name('Dashboard');
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