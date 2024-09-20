<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Cloth;
use App\Models\Color;
use App\Models\Contact;
use App\Models\MenuList;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@essa.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);

        // Cloth::factory(5)->create();

        // Color::factory(10)->create();

        // Contact::factory(10)->create();

        MenuList::create([
            'name' => 'DASHBOARD',
            'path' => '/dashboard'
        ]);

        MenuList::create([
            'name' => 'USER',
            'path' => '/user'
        ]);

        MenuList::create([
            'name' => 'CLOTH',
            'path' => '/cloth'
        ]);

        MenuList::create([
            'name' => 'COLOR',
            'path' => '/color'
        ]);

        MenuList::create([
            'name' => 'CONTACT',
            'path' => '/contact'
        ]);

        MenuList::create([
            'name' => 'RECEIPT',
            'path' => '/receipt'
        ]);


        MenuList::create([
            'name' => 'SALE',
            'path' => '/sale'
        ]);


        MenuList::create([
            'name' => 'STOCK',
            'path' => '/stock'
        ]);


    }
}
