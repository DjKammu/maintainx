<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToAssetModels extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
          Schema::table('asset_models', function (Blueprint $table) {
            $table->dropColumn('brand');
        });
        Schema::table('asset_models', function (Blueprint $table) {
           $table->string('brand')->nullable();
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
            $table->dropColumn('brand');
        });
    }
}
