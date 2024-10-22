<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleBreakup extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'ledger',
        'value'
    ];

    public $timestamps = false;

    protected $table = "sale_breakup";
}
