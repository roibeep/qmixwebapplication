<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\TrackingDelivery;

class Project extends Model
{
    use HasFactory;

    protected $primaryKey = 'projectID';

    protected $fillable = [
        'customerID',
        'name',
        'project_location',
        'end_location',
        'design_mix',
    ];

    // Relationship with customer (User)
    public function customer()
    {
        return $this->belongsTo(User::class, 'customerID');
    }

    // Relationship with deliveries
    public function deliveries()
    {
        return $this->hasMany(TrackingDelivery::class, 'projectID');
    }
}
