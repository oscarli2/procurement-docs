<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseRequest extends Model
{
    use HasFactory;

    // This opens the gates so we can save data to this table
    protected $guarded = []; 

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // This tells Laravel: "One PR has many Items"
    public function items()
    {
        return $this->hasMany(PurchaseRequestItem::class);
    }
}