<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMoreFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tenants', function (Blueprint $table) {
           $table->unsignedBigInteger('property_type_id')->nullable();
           $table->unsignedBigInteger('property_id')->nullable();
           $table->unsignedBigInteger('area_id')->nullable();
           $table->unsignedBigInteger('sub_area_id')->nullable();
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
            $table->dropColumn('property_type_id');
            $table->dropColumn('property_id');
            $table->dropColumn('area_id');
            $table->dropColumn('sub_area_id');
        });
    }
}
