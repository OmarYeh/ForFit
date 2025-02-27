<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class color extends Model
{
    protected $fillable = [
        'name', 
        'Hexcode',
    ];
    public function getItems(){
       
        return $this->belongsToMany(sale::class,'item_color','item_id ','color_id');
       
    }
}
