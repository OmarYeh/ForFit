<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class item extends Model
{
    use HasFactory;

    public function getItempics(){
        return $this->hasMany(itempic::class);
    }

    public function getCategory()
    {
        return $this->belongsToMany(Item::class,'categoryitems','item_id','category_id');
    }
    public function sizes()
    {
        return $this->hasMany(ItemSize::class); 
    }
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'categoryitems', 'item_id', 'category_id');
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    public function images()
    {
        return $this->hasMany(itempic::class);
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class, 'item_colors', 'item_id', 'color_id');
    }
    public function getCurrency(){
        return $this->belongsTo(Currency::class,'currency_id','id');
    }

    public function getItemSizes(){
        return $this->hasMany(itemsize::class);
    }

    public function getSales(){
        return $this->belongsToMany(sale::class,'saleitems','item_id','sale_id');
    }

    public function getOrder(){
        return $this->belongsToMany(sale::class,'orderitems','order_id ','item_id');
    }

    public function getwishlist(){
        return $this->belongsToMany(sale::class,'wisllistitems','wisllist_id ','item_id');
    }

    public function getfav(){
        return $this->belongsToMany(sale::class,'favitems','fav_id ','item_id');
    }

    public function getColor()
{
    return $this->belongsToMany(Color::class, 'item_colors', 'item_id', 'color_id');
}


    public function getReviews(){
        return $this->hasMany(Review::class);
    }
}
