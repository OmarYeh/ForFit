<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CategoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryItemController extends Controller
{
    /**
     * Get all category items.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $categoryItems = CategoryItem::with(['item', 'category'])->get();

        return response()->json([
            'success' => true,
            'data' => $categoryItems,
        ]);
    }
    public function getCategoryItems(Request $request) {
        $category = Category::where('id', $request->id)->with(['items', 'items.getItempics'])->first();
        $category->cimage = asset('storage/category_images/' . $category->cimage);
        if (!$category) {
            return response()->json(['message' => 'No category with that ID!'], 404);
        }
        return response()->json(['category' => $category], 200);
    }
}
