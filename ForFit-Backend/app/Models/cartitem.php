<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class cartitem extends Model
{
    use HasFactory;

    public function items()
{
    return $this->belongsToMany(Item::class, 'cart_items')->withPivot('quantity', 'price');
}

}
