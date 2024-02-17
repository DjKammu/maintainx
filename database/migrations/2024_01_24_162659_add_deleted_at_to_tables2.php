<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtToTables2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sub_areas', function (Blueprint $table) {
             $table->softDeletes();
        });
        Schema::table('asset_models', function (Blueprint $table) {
             $table->softDeletes();
        }); 
        Schema::table('tenants', function (Blueprint $table) {
             $table->softDeletes();
        });
        Schema::table('contractors', function (Blueprint $table) {
             $table->softDeletes();
        });
        Schema::table('vendors', function (Blueprint $table) {
             $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sub_areas', function (Blueprint $table) {
            $table->dropSoftDeletes();
        }); 
        Schema::table('asset_models', function (Blueprint $table) {
            $table->dropSoftDeletes();
        }); 
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropSoftDeletes();
        }); 
        Schema::table('contractors', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
