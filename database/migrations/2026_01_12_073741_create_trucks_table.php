<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trucks', function (Blueprint $table) {
            $table->id('pk_truck_id');
            $table->string('truck_name');
            $table->unsignedBigInteger('fk_employee_id');
            $table->timestamp('date_created')->useCurrent();

            // Foreign key constraint
            $table->foreign('fk_employee_id')
                  ->references('pk_employee_id')
                  ->on('employees')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trucks');
    }
};