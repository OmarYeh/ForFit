<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class itempic extends Model
{
    use HasFactory; 

    public function getItems(){
        return $this->belongsTo(item::class,'item_id','id');
    } 
}
