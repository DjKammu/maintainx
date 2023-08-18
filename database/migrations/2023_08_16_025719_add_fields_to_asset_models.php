<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToAssetModels extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('asset_models', function (Blueprint $table) {
            $table->unsignedBigInteger('asset_type_id')->nullable();
            $table->unsignedBigInteger('property_type_id')->nullable();
           $table->unsignedBigInteger('property_id')->nullable();
           $table->unsignedBigInteger('area_id')->nullable();
           $table->unsignedBigInteger('sub_area_id')->nullable();
           $table->string('serial_number')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('asset_models', function (Blueprint $table) {
            $table->dropColumn('asset_type_id');
            $table->dropColumn('property_type_id');
            $table->dropColumn('property_id');
            $table->dropColumn('area_id');
            $table->dropColumn('sub_area_id');
            $table->dropColumn('serial_number');
        });
    }
}
