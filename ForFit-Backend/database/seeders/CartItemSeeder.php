<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\cartitem;
class CartItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        cartitem::create([
            'Quantity'=>2,
            'price'=>10.99,
            'total_price'=>21.98,
            'item_id'=>2,
            'cart_id'=>1,
            'color_id'=>3,
            'size_id'=>4,
        ]);

        cartitem::create([
            'Quantity'=>1,
            'price'=>6,
            'total_price'=>6,
            'item_id'=>3,
            'cart_id'=>1,
            'color_id'=>2,
            'size_id'=>5,
        ]);

    }
}
