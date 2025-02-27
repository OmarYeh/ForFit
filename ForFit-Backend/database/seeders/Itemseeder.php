<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\item;

class Itemseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        item::create([
            'item_name' => 'Classic Fit Shirt',
            'price' => 29.99,
            'rating' => 0,
            'description' => 'A timeless button-down shirt crafted from premium-quality cotton, designed for maximum comfort and breathability. It features a relaxed fit, making it perfect for both casual and formal settings.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Slim Fit Jeans',
            'price' => 49.99,
            'rating' => 0,
            'description' => 'Modern slim-fit jeans with a comfortable stretch, ideal for everyday wear. Designed to sit perfectly at the waist and taper down to a sleek, stylish fit.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Leather Jacket',
            'price' => 99.99,
            'rating' => 0,
            'description' => 'A stylish and durable leather jacket made from genuine leather with a soft inner lining. It provides warmth and sophistication, making it a statement piece.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Floral Maxi Dress',
            'price' => 39.99,
            'rating' => 0,
            'description' => 'An elegant and flowy maxi dress adorned with beautiful floral prints, perfect for summer outings, vacations, or garden parties.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'High-Waisted Skinny Jeans',
            'price' => 45.99,
            'rating' => 0,
            'description' => 'Designed to hug your curves in all the right places, these high-waisted skinny jeans offer a flattering fit and supreme comfort.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Blazer & Trousers Set',
            'price' => 79.99,
            'rating' => 0,
            'description' => 'A sophisticated two-piece suit set designed for modern professional women. The blazer features a tailored cut, structured shoulders, and a sleek lapel.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Cartoon Print T-Shirt',
            'price' => 14.99,
            'rating' => 0,
            'description' => 'A fun and colorful t-shirt featuring adorable cartoon characters that kids will love. Made from soft, breathable cotton for all-day comfort.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Denim Overalls',
            'price' => 24.99,
            'rating' => 0,
            'description' => 'These classic denim overalls are perfect for active kids who love to play. Made from durable, high-quality denim with adjustable straps.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Winter Puffer Jacket',
            'price' => 34.99,
            'rating' => 0,
            'description' => 'A cozy and lightweight puffer jacket designed to keep kids warm. Featuring a water-resistant outer shell and soft fleece lining.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Satin Evening Gown',
            'price' => 89.99,
            'rating' => 0,
            'description' => 'A breathtaking satin evening gown that exudes elegance and sophistication. Designed with a fitted bodice and a flowing floor-length skirt.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Casual Summer Dress',
            'price' => 29.99,
            'rating' => 0,
            'description' => 'A breezy and lightweight summer dress made from soft, breathable cotton. Featuring a relaxed fit and a flattering V-neckline.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Bodycon Party Dress',
            'price' => 39.99,
            'rating' => 0,
            'description' => 'A stunning and form-fitting bodycon dress that highlights your curves. Made from a stretchy, figure-hugging fabric for a sleek look.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Chino Pants',
            'price' => 34.99,
            'rating' => 0,
            'description' => 'Versatile and stylish, these chino pants are the perfect balance between casual and formal. Made from high-quality cotton twill.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Cargo Pants',
            'price' => 44.99,
            'rating' => 0,
            'description' => 'Designed for both function and fashion, these cargo pants feature multiple spacious pockets, adjustable ankle cuffs, and a relaxed fit.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Joggers',
            'price' => 29.99,
            'rating' => 0,
            'description' => 'Soft, breathable, and incredibly comfortable joggers. Featuring an elastic waistband with a drawstring for a secure yet adjustable fit.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Graphic Tee',
            'price' => 19.99,
            'rating' => 0,
            'description' => 'Express yourself with a trendy graphic t-shirt featuring unique prints. Made from ultra-soft cotton for both comfort and style.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'V-Neck Plain Tee',
            'price' => 14.99,
            'rating' => 0,
            'description' => 'A wardrobe essential, this classic V-neck t-shirt offers simplicity and versatility. Made from high-quality cotton fabric for breathability.',
            'currency_id' => 1,
        ]);
        
        item::create([
            'item_name' => 'Oversized T-Shirt',
            'price' => 24.99,
            'rating' => 0,
            'description' => 'Designed for a relaxed and modern streetwear look, this oversized t-shirt drapes effortlessly. Made from premium cotton for all-day comfort.',
            'currency_id' => 1,
        ]);
        
    }
}
