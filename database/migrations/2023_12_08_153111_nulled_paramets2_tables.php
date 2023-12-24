<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class NulledParamets2Tables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::table('vendors', function (Blueprint $table) {
             $table->string('company_name')->nullable()->change();
        });
        Schema::table('contractors', function (Blueprint $table) {
             $table->string('company_name')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
         Schema::table('vendors', function (Blueprint $table) {
            $table->string('company_name')->change()->nullable(false);
        });
         Schema::table('contractors', function (Blueprint $table) {
            $table->string('company_name')->change()->nullable(false);
        });
    }
}
