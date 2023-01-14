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
Route::get('/clearapp', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Session::flush();
    return redirect('/');
});


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

//Route::resource('roles', RoleController::class)->middleware('can:add_users');
// Route::resource('users', App\Http\Controllers\UserController::class)->middleware('can:add_users');

Route::group(['middleware' => ['can:add_users']], function () {
    
    //react route
    Route::get('/roles', 'RoleController@index')->name('roles.index');
    Route::get('/roles/create', 'RoleController@index')->name('roles.create');
    Route::get('/roles/{role}', 'RoleController@index')->name('roles.show');


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


Route::group(['middleware' => ['auth']], function () {
    Route::get('/logout', 'HomeController@logout')->name('Logout');
    Route::get('/home', 'HomeController@index')->name('Dashboard');
    
    //react route
    Route::get('/lead/list', 'LeadController@index')->name('Leads');
    Route::get('/lead/new', 'LeadController@index')->name('NewLead');
    Route::get('/lead/edit/{id}', 'LeadController@index')->name('EditLead');


});

Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');


// Migration Routes

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