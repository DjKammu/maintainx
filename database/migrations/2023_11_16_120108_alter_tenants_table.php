<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTenantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
         Schema::table('tenants', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
        });
         Schema::table('asset_models', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
        });Schema::table('asset_types', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
        }); Schema::table('asset_works', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
        });Schema::table('order_statuses', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
        }); Schema::table('order_types', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
        });Schema::table('priorities', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
        }); Schema::table('property_types', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
        });Schema::table('work_types', function (Blueprint $table) {
            $table->dropUnique(['account_number']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
         Schema::table('tenants', function (Blueprint $table) {
            $table->unique(['account_number']);
        });Schema::table('asset_models', function (Blueprint $table) {
            $table->unique(['account_number']);
        });Schema::table('asset_types', function (Blueprint $table) {
            $table->unique(['account_number']);
        });Schema::table('asset_works', function (Blueprint $table) {
            $table->unique(['account_number']);
        });Schema::table('order_statuses', function (Blueprint $table) {
            $table->unique(['account_number']);
        });Schema::table('order_types', function (Blueprint $table) {
            $table->unique(['account_number']);
        });Schema::table('priorities', function (Blueprint $table) {
            $table->unique(['account_number']);
        });Schema::table('property_types', function (Blueprint $table) {
            $table->unique(['account_number']);
        });Schema::table('work_types', function (Blueprint $table) {
            $table->unique(['account_number']);
        });
    }
}
