<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Equipment extends Model
{
    protected $table = 'equipment';
    protected $primaryKey = 'pk_equipment_id';

    public $timestamps = false;

    protected $fillable = [
        'equipment_name',
        'fk_employee_id',
    ];

    // Relationship to employee
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'fk_employee_id', 'pk_employee_id');
    }
}
