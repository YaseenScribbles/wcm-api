<?php

namespace App\Models;

use App\Traits\AutoIncrementNo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;
    use AutoIncrementNo;

    protected $fillable = [
        'ref_no',
        'ref_date',
        'contact_id',
        'remarks',
        'user_id',
        'sale_no'
    ];

    public function sale_items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function sale_breakup()
    {
        return $this->hasMany(SaleBreakup::class);
    }

}
