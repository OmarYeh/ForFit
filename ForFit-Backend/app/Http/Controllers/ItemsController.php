<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\item;
use App\Models\catogry;
use App\Models\categoryitem;
use App\Models\itempic;
use App\Models\itemsize;
use App\Models\Review;
use App\Models\Currency;
use App\Models\color;
use App\Models\item_color;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class ItemsController extends Controller
{

    public function create()
    {
        $currencies = Currency::all();
        return view('admin.dashboard', compact('currencies'));
    }
    public function index()
{
    $items = Item::select('id', 'item_name', 'price', 'rating', 'description')
                ->get(); 

    return view('admin.dashboard', compact('items'));
}
public function edit(Item $item)
{
    return view('admin.partials.edit_item_form', [
        'item' => $item->load(['sizes', 'colors', 'categories']),
        'currencies' => Currency::all(),
        'colors' => Color::all(),
        'categories' => Category::all()
    ]);
}
    public function getItems()
    {
        // Fetch items with their associated sizes, images, colors, and reviews
        $items = Item::with(['getItemSizes', 'getItempics', 'getColor', 'getReviews.getUser','getSales'])->get();
        
        // Fetch the sizes and images for each item
        $items->map(function($item) {
            // Add the sizes for each item
            $item->sizes = $this->getItemSizes($item);
    
            // Add the images for each item
            $item->images = $this->getItemImages($item);
    
            return $item;
        });
    
        // Return the items along with the sizes and images
        return response()->json(['items' => $items], 200);
    }
    
    // Function to get sizes for an item
    public function getItemSizes($item)
    {
        // Assuming 'getItemSizes' is the relationship on the Item model
        $sizes = $item->getItemSizes;
    
        // Optionally, you can return just the size names or IDs based on your frontend needs
        return $sizes->map(function($size) {
            return [
                'id' => $size->id,
                'size' => $size->size_name, // Adjust field name based on your table structure
            ];
        });
    }
    
    // Function to get images for an item
    public function getItemImages($item)
    {
        // Assuming 'getItempics' is the relationship on the Item model
        $images = $item->getItempics;
    
        // Map through the images and return the full URL for each one
        return $images->map(function($itempic) {
            // Check if the itempic has a valid image filename
            if ($itempic->itemimage) {
                // Build the full URL to the image stored in the public/storage/items/ directory
                return asset('storage/items/' . $itempic->itemimage);
            }
            return null; // If no image, return null
        });
    }
    
    
    

    
    public function getcurrencies(){
        $currency = Currency::all()->first();
        return response()->json(['currencies',$currency],200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_name' => 'required|string',
            'price' => 'required|numeric',
            'rating' => 'nullable|numeric|min:0|max:5',
            'description' => 'required|string',
            'currency_id' => 'required|exists:currencies,id',
            'sizes' => 'required|array',
            'sizes.*.garment_type' => 'required|string',
            'sizes.*.size_label' => 'required|string',
            'sizes.*.chest_size' => 'nullable|numeric',
            'sizes.*.waist' => 'nullable|numeric',
            'sizes.*.hip' => 'nullable|numeric',
            'sizes.*.height' => 'nullable|numeric',
            'sizes.*.length' => 'nullable|numeric',
            'sizes.*.neck_size' => 'nullable|numeric',
            'sizes.*.sleeve_length' => 'nullable|numeric',
            'sizes.*.shoulder_width' => 'nullable|numeric',
            'sizes.*.inseam_length' => 'nullable|numeric',
            'sizes.*.leg_opening' => 'nullable|numeric',
            'sizes.*.bust' => 'nullable|numeric',
            'sizes.*.waist_to_hem' => 'nullable|numeric',
            'item_image' => 'required|array',
            'item_image.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'colors' => 'required|array',
            'colors.*' => 'exists:colors,id',
            'cat_ids' => 'required|array',
            'cat_ids.*' => 'exists:categories,id',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }
    
        try {
            // Create the item
            $item = new Item();
            $item->item_name = $request->item_name;
            $item->price = $request->price;
            $item->rating = $request->rating ?? 0;
            $item->description = $request->description;
            $item->currency_id = $request->currency_id;
            $item->save();
    
            // Save sizes
            if (is_array($request->sizes)) {
                foreach ($request->sizes as $size) {
                    $itemSize = new Itemsize();
                    $itemSize->item_id = $item->id;
                    $itemSize->garment_type = $size['garment_type'];
                    $itemSize->size_label = $size['size_label'];
                    $itemSize->chest_size = $size['chest_size'] ?? null;
                    $itemSize->waist = $size['waist'] ?? null;
                    $itemSize->hip = $size['hip'] ?? null;
                    $itemSize->height = $size['height'] ?? null;
                    $itemSize->length = $size['length'] ?? null;
                    $itemSize->neck_size = $size['neck_size'] ?? null;
                    $itemSize->sleeve_length = $size['sleeve_length'] ?? null;
                    $itemSize->shoulder_width = $size['shoulder_width'] ?? null;
                    $itemSize->inseam_length = $size['inseam_length'] ?? null;
                    $itemSize->leg_opening = $size['leg_opening'] ?? null;
                    $itemSize->bust = $size['bust'] ?? null;
                    $itemSize->waist_to_hem = $size['waist_to_hem'] ?? null;
                    $itemSize->save();
                }
            }
    
            if ($request->hasFile('item_image')) {
                foreach ($request->file('item_image') as $image) {
                    $extension = $image->getClientOriginalExtension();
            
                    $filename = time() . '_' . uniqid() . '.' . $extension;
            
                    $path = $image->storeAs('items', $filename, 'public');
            
                    $itemPic = new Itempic();
                    $itemPic->item_id = $item->id;  
                    $itemPic->itemimage = $filename; 
                    $itemPic->save();
                }
            }
            

    
            // Save colors
            if (is_array($request->colors)) {
                foreach ($request->colors as $colorId) {
                    $itemColor = new Item_color();
                    $itemColor->item_id = $item->id;
                    $itemColor->color_id = $colorId;
                    $itemColor->save();
                }
            }
    
            // Save categories
            if (is_array($request->cat_ids)) {
                foreach ($request->cat_ids as $category) {
                    $categoryItem = new Categoryitem();
                    $categoryItem->item_id = $item->id;
                    $categoryItem->category_id = $category;
                    $categoryItem->save();
                }
            }
    
            return redirect()->back()->with('success', 'Item successfully added.');

        } catch (Exception $e) {
            Log::error('Failed to create item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create item.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function destroy(Item $item)
    {
        $item->delete();
        return redirect()->back()->with('success', 'Item deleted successfully.');
    }
    public function GetItem(Request $request){
        $item = item::with(['getItemSizes', 'getItempics', 'getColor', 'getReviews.getUser','getSales'])->where('id', $request->item_id)->first();
        
        $itemData = [
            'id' => $item->id,
            'item_name' => $item->item_name,
            'price' => $item->price,
            'rating' => $item->rating,
            'description' => $item->description,
            'currency_id' => $item->currency_id,
            'created_at' => $item->created_at,
            'updated_at' => $item->updated_at,
            'sizes' => $item->getItemSizes, 
            'images' => $this->getItemImages($item),
            'colors' => $item->getColor, 
            'reviews' => $item->getReviews, 
            'sales' => $item->getSales,
        ];

       return response()->json(['Item'=>$itemData],200);
    }

    public function update(Request $request, Item $item)
    {

        $validator = Validator::make($request->all(), [
            'item_name' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'rating' => 'nullable|numeric|min:0|max:5',
            'description' => 'sometimes|required|string',
            'currency_id' => 'sometimes|required|exists:currencies,id',
            'sizes' => 'nullable|array',
            'sizes.*.garment_type' => 'required|string',
            'sizes.*.size_label' => 'required|string',
            'sizes.*.chest_size' => 'nullable|numeric',
            'sizes.*.waist' => 'nullable|numeric',
            'sizes.*.hip' => 'nullable|numeric',
            'sizes.*.height' => 'nullable|numeric',
            'sizes.*.length' => 'nullable|numeric',
            'sizes.*.neck_size' => 'nullable|numeric',
            'sizes.*.sleeve_length' => 'nullable|numeric',
            'sizes.*.shoulder_width' => 'nullable|numeric',
            'sizes.*.inseam_length' => 'nullable|numeric',
            'sizes.*.leg_opening' => 'nullable|numeric',
            'sizes.*.bust' => 'nullable|numeric',
            'sizes.*.waist_to_hem' => 'nullable|numeric',
            'item_images' => 'nullable|array',
            'item_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'colors' => 'nullable|array',
            'colors.*' => 'exists:colors,id',
            'cat_ids' => 'required|array',
            'cat_ids.*' => 'exists:categories,id',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }
    
        try {
            // Update item details
            $item->item_name = $request->item_name;
            $item->price = $request->price;
            $item->rating = $request->rating ?? 0;
            $item->description = $request->description;
            $item->currency_id = $request->currency_id;
            $item->save();
    
            // Update sizes
            if (is_array($request->sizes)) {
                Itemsize::where('item_id', $item->id)->delete();
                foreach ($request->sizes as $size) {
                    $itemSize = new Itemsize();
                    $itemSize->item_id = $item->id;
                    $itemSize->garment_type = $size['garment_type'];
                    $itemSize->size_label = $size['size_label'];
                    $itemSize->chest_size = $size['chest_size'] ?? null;
                    $itemSize->waist = $size['waist'] ?? null;
                    $itemSize->hip = $size['hip'] ?? null;
                    $itemSize->height = $size['height'] ?? null;
                    $itemSize->length = $size['length'] ?? null;
                    $itemSize->neck_size = $size['neck_size'] ?? null;
                    $itemSize->sleeve_length = $size['sleeve_length'] ?? null;
                    $itemSize->shoulder_width = $size['shoulder_width'] ?? null;
                    $itemSize->inseam_length = $size['inseam_length'] ?? null;
                    $itemSize->leg_opening = $size['leg_opening'] ?? null;
                    $itemSize->bust = $size['bust'] ?? null;
                    $itemSize->waist_to_hem = $size['waist_to_hem'] ?? null;
                    $itemSize->save();
                }
            }
   $deletedImages = $request->input('delete_images', []);
   // Delete marked images
   if ($request->delete_images) {
    foreach ($request->delete_images as $imageId) {
        $image = ItemPic::find($imageId);
        
        if ($image) {
            // Delete from storage
            Storage::delete('items/'.$image->itemimage);
            // Delete database record
            $image->delete();
        }
    }
}
if ($request->hasFile('item_image')) {
    foreach ($request->file('item_image') as $image) {
        $extension = $image->getClientOriginalExtension();

        $filename = time() . '_' . uniqid() . '.' . $extension;

        $path = $image->storeAs('items', $filename, 'public');

        $itemPic = new Itempic();
        $itemPic->item_id = $item->id;  
        $itemPic->itemimage = $filename; 
        $itemPic->save();
    }
}

    
            if (is_array($request->colors)) {
                Item_color::where('item_id', $item->id)->delete();
                foreach ($request->colors as $colorId) {
                    $itemColor = new Item_color();
                    $itemColor->item_id = $item->id;
                    $itemColor->color_id = $colorId;
                    $itemColor->save();
                }
            }
    
            if (is_array($request->cat_ids)) {
                Categoryitem::where('item_id', $item->id)->delete();
                foreach ($request->cat_ids as $category) {
                    $categoryItem = new Categoryitem();
                    $categoryItem->item_id = $item->id;
                    $categoryItem->category_id = $category;
                    $categoryItem->save();
                }
            }
    
            return redirect()->back()->with('success', 'Item successfully updated.');

        } catch (Exception $e) {
            Log::error('Failed to update item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update item.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function DeleteItem(Request $request){
        $item = item::where('id',$request->item_id);
        $item->detele();
        return response()->json(['message' => 'Item deleted'], 200);
    }

    

    public function searchItems(Request $request)
    {
        $query = $request->input('query');
    
        // Validate query
        if (empty($query)) {
            return response()->json(['message' => 'Search query is required'], 400);
        }
    
        // Fetch only item details along with the first image using getItemPics() method
        $items = Item::select('id', 'item_name', 'description', 'price')
            ->with(['getItemPics' => function ($query) {
                $query->limit(1); // Limit to the first image
            }])
            ->where('item_name', 'LIKE', "%$query%")
            ->orWhereHas('getItemSizes', function ($queryBuilder) use ($query) {
                $queryBuilder->where('size_label', 'LIKE', "%$query%");
            })
            ->orWhereHas('getColor', function ($queryBuilder) use ($query) {
                $queryBuilder->where('name', 'LIKE', "%$query%");
            })
            ->get();
           
        // Prepare items with the first image URL
        $itemsWithImages = $items->map(function ($item) {
            // Assuming 'getItemPics' relation is loaded and contains the images
            $firstImage = $item->getItemPics->isNotEmpty() ? $item->getItemPics->first()->itemimage : null;
            $DiscountPrice = 0;
            $sale = $item->getSales()->first();
            if($sale){
                $DiscountPrice =  number_format($item->price * (1 - ($sale->Discount / 100)), 2, '.', '');
            }
            return [
                'id' => $item->id,
                'item_name' => $item->item_name,
                'description' => $item->description,
                'price' => $item->price,
                'image_url' => $firstImage,
                'DiscountPrice' => $DiscountPrice
            ];
        });
    
        return response()->json(['items' => $itemsWithImages], 200);
    }
    
    public function CreateReview(Request $request){

        $user = Auth::user();
        $review = new review();
        $review->user_id = $user->id;
        $review->rating = $request->rating;
        $review->item_id= $request->item_id;
        $review->Description = $request->Description;
        $review->save();
        return response()->json(['success' => "review created!"], 200);
    }
    
}

