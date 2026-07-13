<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpmpItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function ppmp()
    {
        return $this->belongsTo(Ppmp::class);
    }
}
