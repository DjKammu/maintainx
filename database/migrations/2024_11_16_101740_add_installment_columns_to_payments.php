<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInstallmentColumnsToPayments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('invoice_number')->nullable();
            $table->date('invoice_date')->nullable();
            $table->string('draw_number')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('payments', function (Blueprint $table) {
              $table->dropColumn('invoice_number');
              $table->dropColumn('invoice_date');
              $table->dropColumn('draw_number');
        });
    }
}
