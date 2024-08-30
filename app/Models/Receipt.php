<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref_no',
        'ref_date',
        'contact_id',
        'remarks',
        'user_id',
    ];
}
