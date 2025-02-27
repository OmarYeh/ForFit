<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class sale extends Model
{
    use HasFactory;

    public function getItems()
    {
        return $this->belongsToMany(Item::class,'saleitems','sale_id','item_id');
    }
}
