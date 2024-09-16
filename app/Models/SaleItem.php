<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'cloth_id',
        'color_id',
        'weight',
        'rate',
        'amount',
        's_no',
    ];

    public $timestamps = false;
}
