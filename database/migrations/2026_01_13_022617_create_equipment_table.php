<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id('pk_equipment_id');
            $table->string('equipment_name');
            $table->unsignedBigInteger('fk_employee_id');
            $table->timestamp('date_created')->useCurrent();

            $table->foreign('fk_employee_id')
                  ->references('pk_employee_id')
                  ->on('employees')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
