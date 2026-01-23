<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Changed from Customer
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
        'fk_item_id',
        'date_created',
        'date_updated',
        'schedule_date',
        'schedule_time',
    ];

    protected $casts = [
        'total_delivery' => 'float',
        'date_created' => 'datetime:Y-m-d H:i:s',
        'date_updated' => 'datetime:Y-m-d H:i:s',
        'schedule_date' => 'date:Y-m-d',
        'schedule_time' => 'string',
    ];

    // Relationships
    public function customer()
    {
        // Changed: Now points to User model with 'id' as the foreign key
        return $this->belongsTo(User::class, 'fk_customer_id', 'id');
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