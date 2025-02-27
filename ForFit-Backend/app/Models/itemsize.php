<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class itemsize extends Model
{
    use HasFactory;
    protected $fillable = [
        'garment_type',
        'size_label',
        'chest_size',
        'waist',
        'hip',
        'height',
        'length',
        'neck_size',
        'sleeve_length',
        'shoulder_width',
        'inseam_length',
        'leg_opening',
        'bust',
        'waist_to_hem',
        'item_id'
    ];
    public function getItems(){
        return $this->belongsTo(item::class,'item_id','id');
    }

    public function getCartItems(){
        return $this->hasMany(Cart::class);
    }
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

}
