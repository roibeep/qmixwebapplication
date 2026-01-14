<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $table = 'employees';

    protected $primaryKey = 'pk_employee_id';

    public $timestamps = false;

    protected $fillable = [
        'employee_name',
    ];
}
