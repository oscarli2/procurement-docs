<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rfq extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // An RFQ has many items
    public function items() {
        return $this->hasMany(RfqItem::class);
    }

    // An RFQ belongs to a Purchase Request
    public function purchaseRequest() {
        return $this->belongsTo(PurchaseRequest::class);
    }

    // Expose the PR's office/section as `end_user` for the PDF
    public function getEndUserAttribute()
    {
        if ($this->relationLoaded('purchaseRequest')) {
            $pr = $this->purchaseRequest;
        } else {
            $pr = $this->purchaseRequest()->first();
        }

        return $pr->office_section ?? null;
    }

    // Computed attribute: sum of all item total_abc values
    public function getTotalAbcAttribute()
    {
        // Ensure items relationship is loaded to avoid extra queries
        return $this->items->sum('total_abc');
    }
}