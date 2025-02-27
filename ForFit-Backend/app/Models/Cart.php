<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;
    public function getUser(){
        $this->belongsTo(User::class,'user_id','id');
    }

    public function getItems()
    {
        return $this->belongsToMany(Item::class,'cartitems','cart_id','item_id')->withPivot('Quantity','price','total_price','color_id','size_id');    
    }
    public function cartItems()
{
    return $this->hasMany(CartItem::class);
}
}
