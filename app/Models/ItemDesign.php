<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemDesign extends Model
{
    protected $table = 'items';
    protected $primaryKey = 'pk_item_id';

    public $timestamps = false;

    protected $fillable = [
        'item_name',
    ];
}
