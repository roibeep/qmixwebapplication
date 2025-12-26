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
        Schema::create('tracking_deliveries', function (Blueprint $table) {
            $table->id('deliveryID');
            $table->string('mp_no');
            $table->string('truck_no');
            $table->decimal('volume', 8, 2);
            $table->decimal('overall_volume', 10, 2)->nullable();
            $table->enum('delivery_status', ['SO Created', 'Schedule Create', 'Batching on Process', 'Out for Delivery', 'Delivered'])->default('SO Created');
            $table->timestamps();
            $table->unsignedBigInteger('projectID')->nullable();
            $table->foreign('projectID')->references('projectID')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_deliveries');
    }
};
