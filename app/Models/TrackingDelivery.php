<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Project;

class TrackingDelivery extends Model
{
    use HasFactory;

    protected $primaryKey = 'deliveryID';

    protected $fillable = [
        'projectID',
        'mp_no',
        'truck_no',
        'volume',
        'delivery_status',
    ];

    // Relationship with project
    public function project()
    {
        return $this->belongsTo(Project::class, 'projectID');
    }

    // Accessor for overall volume (sum of previous volumes)
    public function getOverallVolumeAttribute()
    {
        return self::where('projectID', $this->projectID)
                    ->where('deliveryID', '<=', $this->deliveryID)
                    ->sum('volume');
    }
}
