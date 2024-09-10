<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref_no',
        'ref_date',
        'contact_id',
        'remarks',
        'user_id',
    ];

    public function sale_items()
    {
        return $this->hasMany(SaleItem::class);
    }

}
