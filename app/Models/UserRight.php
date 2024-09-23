<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRight extends Model
{
    use HasFactory;

    protected $table = [
        'user_id',
        'menu_id',
        'edit',
        'delete'
    ];

    public $timestamps = false;

}
