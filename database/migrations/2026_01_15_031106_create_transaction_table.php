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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id('pk_transac_id');
            $table->string('so_no')->unique();
            $table->decimal('total_delivery', 10, 2);
            $table->unsignedBigInteger('fk_customer_id'); // Still called fk_userclient_id for clarity, but references users table
            $table->unsignedBigInteger('fk_equipment_id')->nullable();
            $table->unsignedBigInteger('fk_item_id')->nullable();
            $table->timestamp('date_created')->useCurrent();
            $table->timestamp('date_updated')->nullable();

            // Changed to reference 'users' table instead of 'customers'
            $table->foreign('fk_customer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('fk_equipment_id')->references('pk_equipment_id')->on('equipment')->onDelete('set null');
            $table->foreign('fk_item_id')->references('pk_item_id')->on('items')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};