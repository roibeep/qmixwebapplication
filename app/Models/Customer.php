<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Customer extends Authenticatable
{
    use Notifiable;

    protected $table = 'customers';
    protected $primaryKey = 'pk_customer_id';
    public $timestamps = false;

    protected $fillable = [
        'customer_name',
        'contact_person',
        'contact_number',
        'address',
        'role',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_created' => 'datetime',
    ];

    // Automatically set role to 'client' when creating
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            if (!$customer->role) {
                $customer->role = 'client';
            }
        });
    }
}