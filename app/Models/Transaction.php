<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;
use App\Models\Equipment;
use App\Models\ItemDesign;
use App\Models\TrackingDelivery;

class Transaction extends Model
{
    protected $table = 'transactions';
    protected $primaryKey = 'pk_transac_id';
    public $timestamps = false;

    protected $fillable = [
        'so_no',
        'total_delivery',
        'fk_customer_id',
        'fk_equipment_id',
        'fk_item_id',
        'date_created',
        'date_updated',
    ];

    protected $casts = [
        'total_delivery' => 'float',
        'date_created' => 'datetime:Y-m-d H:i:s',
        'date_updated' => 'datetime:Y-m-d H:i:s',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'fk_customer_id', 'pk_customer_id');
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'fk_equipment_id', 'pk_equipment_id');
    }

    public function item()
    {
        return $this->belongsTo(ItemDesign::class, 'fk_item_id', 'pk_item_id');
    }

    public function deliveries()
    {
        return $this->hasMany(TrackingDelivery::class, 'fk_transac_id', 'pk_transac_id');
    }
}
