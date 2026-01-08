<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'departmentID',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'departmentID', 'departmentID');
    }

    public function isPrdUser(): bool
    {
        if (!$this->relationLoaded('department')) {
            $this->load('department');
        }

        return $this->role === 'user'
            && $this->department?->name === 'PRD Department';
    }

    public function canManageProjects(): bool
    {
        return ($this->role === 'superadmin' || $this->role === 'user')
        && $this->department?->name === 'PRD Department';
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'customerID');
    } 
}
