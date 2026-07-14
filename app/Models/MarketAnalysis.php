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
        return $this->items->sum('adjusted_price');
    }

    public function getCompletedAttribute()
    {
        return $this->status === 'priced';
    }
}