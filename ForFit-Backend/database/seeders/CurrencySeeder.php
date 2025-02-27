<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();

        DB::table('currencies')->insert([
            [
                'id' => 1,
                'Currency_code' => 'USD',
                'exchange_rate' => 1.00,
                'symbol' => '$',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'Currency_code' => 'EUR',
                'exchange_rate' => 0.85,
                'symbol' => '€',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'Currency_code' => 'GBP',
                'exchange_rate' => 0.75,
                'symbol' => '£',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 4,
                'Currency_code' => 'JPY',
                'exchange_rate' => 110.00,
                'symbol' => '¥',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 5,
                'Currency_code' => 'AUD',
                'exchange_rate' => 1.30,
                'symbol' => 'A$',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
