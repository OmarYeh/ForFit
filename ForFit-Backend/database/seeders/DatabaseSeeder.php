<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CurrencySeeder::class,
            CategorySeeder::class,
            Itemseeder::class,
            ColorSeeder::class,
            ItemSizeseeder::class,
            ColorItemSeeder::class,
            CartItemSeeder::class,
        ]);
    }
}
