<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['category_name','cimage'];

    public function items()
    {
        return $this->belongsToMany(Item::class, 'categoryitems', 'category_id', 'item_id');
    }

}
