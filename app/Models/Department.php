<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $primaryKey = 'departmentID';
    public $timestamps = false;
    protected $fillable = ['name', 'description', 'create_date'];
}
