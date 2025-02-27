<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\color;
class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        color::create([
            'name' => 'black',
            'Hexcode' => '#000000',
        ]);

        color::create([
            'name' => 'red',
            'Hexcode' => '#FF0000',
        ]);
    }
}
