<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tracking_deliveries', function (Blueprint $table) {
            $table->id('pk_delivery_id');
            $table->string('mp_no');
            $table->decimal('volume', 10, 2);
            $table->decimal('overall_volume', 10, 2);
            $table->enum('delivery_status', ['Batching on Process','Out for Delivery','Delivered'])->default('Batching on Process');
            $table->timestamp('date_created')->useCurrent();
            $table->timestamp('date_updated')->nullable();
            
            $table->unsignedBigInteger('fk_transac_id');
            $table->foreign('fk_transac_id')->references('pk_transac_id')->on('transactions')->onDelete('cascade');

            $table->unsignedBigInteger('fk_equipment_id'); // ✅ Changed from pk_equipment_id to fk_equipment_id
            $table->foreign('fk_equipment_id')->references('pk_equipment_id')->on('equipment')->onDelete('cascade'); // ✅ Fixed foreign key
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking_deliveries');
    }
};