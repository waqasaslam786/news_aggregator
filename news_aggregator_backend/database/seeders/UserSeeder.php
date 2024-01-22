<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'firstName' => "super",
            'lastName' => "admin",
            'email' => 'support@yopmail.com',
            'password' => bcrypt('secret123')
        ]);
    }
}