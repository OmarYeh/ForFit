<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Address;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'UserName', 
        'email',
        'password',
        'role_id',
        'profile_picture',
        'age',
        'remember_token',
    ];
    

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getRole(){
        return $this->belongsTo(Role::class,'role_id','id');
    }

    public function getFav(){
        return $this->hasOne(Favorite::class);
    }

    public function getWishlist(){
        return $this->hasOne(Wishlist::class);
    }

    public function addresses()
{
    return $this->hasMany(Address::class);
}

    public function getCart(){
        return $this->hasOne(Cart::class);
    }

    public function getOrders(){
        return $this->hasMany(Order::class);
    }

    public function getReviews(){
        return $this->hasMany(Review::class); 
    }
}
