<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class item_color extends Model
{
    public function items()
    {
        return $this->belongsToMany(Item::class, 'item_colors', 'color_id', 'item_id');
    }
    
}
