<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Transaction;
use App\Models\Equipment;

class TrackingDelivery extends Model
{
    protected $table = 'tracking_deliveries';
    protected $primaryKey = 'pk_delivery_id';
    public $timestamps = false;

    protected $fillable = [
        'fk_transac_id',
        'mp_no',
        'fk_equipment_id',
        'volume',
        'delivery_status',
        'overall_volume',
        'schedule_date',
        'schedule_time',
        'date_created',
        'date_updated',
    ];

    protected $casts = [
        'volume' => 'float',
        'overall_volume' => 'float',
        'schedule_date' => 'date',
        'schedule_time' => 'string',
        'date_created' => 'datetime:Y-m-d H:i:s',
        'date_updated' => 'datetime:Y-m-d H:i:s',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'fk_transac_id', 'pk_transac_id');
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'fk_equipment_id', 'pk_equipment_id');
    }
}
