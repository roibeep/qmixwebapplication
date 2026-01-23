<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id('pk_employee_id');
            $table->string('employee_name');
            $table->timestamp('date_created')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};