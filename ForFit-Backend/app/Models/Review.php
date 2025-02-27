<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    public function getUser(){
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function getItem(){
        return $this->belongsTo(item::class,'item_id','id');
    }
}
