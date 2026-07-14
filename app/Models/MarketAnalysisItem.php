<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketAnalysisItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function marketAnalysis()
    {
        return $this->belongsTo(MarketAnalysis::class);
    }

    public function getMarkupAmountAttribute($value)
    {
        return $value === null ? null : (int) $value;
    }
}