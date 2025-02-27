<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Favorite extends Model
{
    use HasFactory;

    public function getUser(){
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function getItems()
    {
        return $this->belongsToMany(Item::class,'favitems','fav_id','item_id')->withPivot('added_at');
    }
}
