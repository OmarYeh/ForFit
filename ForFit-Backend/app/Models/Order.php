<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    public function getItems()
    {
        return $this->belongsToMany(item::class,'orderitems','order_id','item_id')->withPivot('Quantity','price','total_price');
    }

    public function getUser(){
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function getAddress(){
        return $this->belongsTo(address::class,'address_id','id');
    }
}
