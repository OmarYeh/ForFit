<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\item_color;
class ColorItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        item_color::create(['item_id' => 3, 'color_id' => 1]);
        item_color::create(['item_id' => 3, 'color_id' => 3]);
        item_color::create(['item_id' => 3, 'color_id' => 5]);
        
        item_color::create(['item_id' => 4, 'color_id' => 4]);
        item_color::create(['item_id' => 4, 'color_id' => 1]);
        
        item_color::create(['item_id' => 5, 'color_id' => 5]);
        item_color::create(['item_id' => 5, 'color_id' => 1]);
        item_color::create(['item_id' => 5, 'color_id' => 6]);
        
        item_color::create(['item_id' => 6, 'color_id' => 3]);
        item_color::create(['item_id' => 6, 'color_id' => 6]);
        
        item_color::create(['item_id' => 7, 'color_id' => 4]);
        item_color::create(['item_id' => 7, 'color_id' => 5]);
        item_color::create(['item_id' => 7, 'color_id' => 6]);
        
        item_color::create(['item_id' => 8, 'color_id' => 3]);
        item_color::create(['item_id' => 8, 'color_id' => 6]);
        item_color::create(['item_id' => 8, 'color_id' => 1]);
        item_color::create(['item_id' => 8, 'color_id' => 4]);
        
        item_color::create(['item_id' => 9, 'color_id' => 1]);
        item_color::create(['item_id' => 9, 'color_id' => 4]);
        item_color::create(['item_id' => 9, 'color_id' => 3]);
        
        item_color::create(['item_id' => 10, 'color_id' => 5]);
        item_color::create(['item_id' => 10, 'color_id' => 6]);
        
        item_color::create(['item_id' => 11, 'color_id' => 1]);
        item_color::create(['item_id' => 11, 'color_id' => 4]);
        item_color::create(['item_id' => 11, 'color_id' => 3]);
        
        item_color::create(['item_id' => 12, 'color_id' => 3]);
        item_color::create(['item_id' => 12, 'color_id' => 5]);
        item_color::create(['item_id' => 12, 'color_id' => 6]);
        
        item_color::create(['item_id' => 13, 'color_id' => 4]);
        item_color::create(['item_id' => 13, 'color_id' => 6]);
        item_color::create(['item_id' => 13, 'color_id' => 5]);
        
        item_color::create(['item_id' => 14, 'color_id' => 1]);
        item_color::create(['item_id' => 14, 'color_id' => 5]);
        item_color::create(['item_id' => 14, 'color_id' => 3]);
        item_color::create(['item_id' => 14, 'color_id' => 4]);
        
        item_color::create(['item_id' => 15, 'color_id' => 3]);
        item_color::create(['item_id' => 15, 'color_id' => 6]);
        item_color::create(['item_id' => 15, 'color_id' => 1]);
        
        item_color::create(['item_id' => 16, 'color_id' => 4]);
        item_color::create(['item_id' => 16, 'color_id' => 5]);
        item_color::create(['item_id' => 16, 'color_id' => 3]);
        
        item_color::create(['item_id' => 17, 'color_id' => 1]);
        item_color::create(['item_id' => 17, 'color_id' => 3]);
        item_color::create(['item_id' => 17, 'color_id' => 6]);
        
        item_color::create(['item_id' => 18, 'color_id' => 5]);
        item_color::create(['item_id' => 18, 'color_id' => 6]);
        item_color::create(['item_id' => 18, 'color_id' => 4]);
        item_color::create(['item_id' => 18, 'color_id' => 3]);
        
        item_color::create(['item_id' => 19, 'color_id' => 3]);
        item_color::create(['item_id' => 19, 'color_id' => 4]);
        item_color::create(['item_id' => 19, 'color_id' => 1]);
        
        item_color::create(['item_id' => 20, 'color_id' => 1]);
        item_color::create(['item_id' => 20, 'color_id' => 6]);
        item_color::create(['item_id' => 20, 'color_id' => 5]);
        item_color::create(['item_id' => 20, 'color_id' => 4]);
        
    }
}
