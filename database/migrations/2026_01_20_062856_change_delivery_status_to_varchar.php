<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeDeliveryStatusToVarchar extends Migration
{
    public function up()
    {
        Schema::table('tracking_deliveries', function (Blueprint $table) {
            $table->string('delivery_status', 50)->change();
        });
    }

    public function down()
    {
        Schema::table('tracking_deliveries', function (Blueprint $table) {
            $table->enum('delivery_status', [
                'SO Created',
                'Schedule Create',
                'Batching on Process',
                'Out for Delivery',
                'Delivered'
            ])->change();
        });
    }
}