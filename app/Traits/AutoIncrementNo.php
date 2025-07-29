<?php

namespace App\Traits;

trait AutoIncrementNo
{
    public static function bootAutoIncrementNo()
    {
        static::creating(function ($model) {
            if ($model->getTable() === 'receipts') {
                $lastNo = self::max('r_no') ?? 0;
                $model->r_no = $lastNo + 1;
            } elseif ($model->getTable() === 'sales') {
                $lastNo = self::max('sale_no') ?? 0;
                $model->sale_no = $lastNo + 1;
            }
        });
    }
}
