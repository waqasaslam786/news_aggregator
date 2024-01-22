<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesSeeder extends Seeder
{
    public function run()
    {
        $categoriesArr = array('business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology');

        foreach ($categoriesArr as $category) {
            Category::create([
                'name' => $category,
            ]);
        }
    }
}