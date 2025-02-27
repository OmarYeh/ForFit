<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'UserName' => 'rami mahdi',
            'email' => 'r@gmail.com',
            'password' => Hash::make('123'),
            'role_id' => 1,
        ]);
    }
}
