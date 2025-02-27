<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    public function run()
    {
        DB::table('categories')->insert([
            [
                'id' => 1,
                'category_name' => 'Men',
                'cimage' => 'men_category.jpeg',
                'parent_id' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'category_name' => 'Women',
                'cimage' => 'women_category.jpg',
                'parent_id' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 3,
                'category_name' => 'Kids',
                'cimage' => 'kids_category.jpeg',
                'parent_id' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 4,
                'category_name' => 'Shoes',
                'cimage' => 'shoes_category.png',
                'parent_id' => 1, // Men category
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 5,
                'category_name' => 'Accessories',
                'cimage' => 'accessories_category.png',
                'parent_id' => 2, // Women category
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 7,
                'category_name' => 'Sportswear',
                'cimage' => 'sportswear_category.jpeg',
                'parent_id' => 1, // Men category
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 8,
                'category_name' => 'Dresses',
                'cimage' => 'dresses_category.jpg',
                'parent_id' => 2, // Women category
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 9,
                'category_name' => 'Baby Clothes',
                'cimage' => 'baby_clothes_category.jpeg',
                'parent_id' => 3, // Kids category
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
