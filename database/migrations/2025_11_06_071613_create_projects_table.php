<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
        $table->id('projectID');
        $table->string('projectname');
        $table->unsignedBigInteger('customerID')->nullable();
        $table->foreign('customerID')
              ->references('id')
              ->on('users')
              ->onDelete('set null');

        $table->string('project_location');
        $table->string('end_location')->nullable();
        $table->string('design_mix')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
