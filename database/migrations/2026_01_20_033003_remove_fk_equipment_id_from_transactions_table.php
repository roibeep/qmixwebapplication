<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['fk_equipment_id']); // Drop foreign key first
            $table->dropColumn('fk_equipment_id');    // Then drop the column
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('fk_equipment_id')->nullable()->after('fk_customer_id');
            $table->foreign('fk_equipment_id')->references('pk_equipment_id')->on('equipment')->onDelete('set null');
        });
    }
};