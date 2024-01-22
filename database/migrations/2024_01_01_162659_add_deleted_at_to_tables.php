<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtToTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('asset_types', function (Blueprint $table) {
             $table->softDeletes();
        });
        Schema::table('work_types', function (Blueprint $table) {
             $table->softDeletes();
        }); 
        Schema::table('property_types', function (Blueprint $table) {
             $table->softDeletes();
        });
        Schema::table('properties', function (Blueprint $table) {
             $table->softDeletes();
        });
        Schema::table('areas', function (Blueprint $table) {
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
        Schema::table('asset_types', function (Blueprint $table) {
            $table->dropSoftDeletes();
        }); 
        Schema::table('work_types', function (Blueprint $table) {
            $table->dropSoftDeletes();
        }); 
        Schema::table('property_types', function (Blueprint $table) {
            $table->dropSoftDeletes();
        }); 
        Schema::table('properties', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('areas', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
