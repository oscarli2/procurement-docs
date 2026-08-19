<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketAnalysis extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(MarketAnalysisItem::class);
    }

    public function getTotalAdjustedAttribute()
    {
        return $this->items->sum(function ($item) {
            return (float) ($item->qty ?? 0) * (float) ($item->adjusted_price ?? 0);
        });
    }

    public function getCompletedAttribute()
    {
        return $this->status === 'priced';
    }
}
