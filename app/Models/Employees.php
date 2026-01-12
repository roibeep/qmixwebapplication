<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employees extends Model
{
    protected $table = 'pk_employees_id';
    protected $primaryKey = 'pk_employee_id';

    public $timestamps = false;

    protected $fillable = [
        'employee_name',
    ];
}
