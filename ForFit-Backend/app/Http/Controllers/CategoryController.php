<?php

namespace App\Http\Controllers;
use App\Models\item;
use App\Models\catogry;
use App\Models\categoryitem;
use App\Models\itempic;
use App\Models\itemsize;
use App\Models\color;
use App\Models\item_color;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\category;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class CategoryController extends Controller
{

    public function index(){
        $categories = Category::all();
        return view('admin.categories', compact('categories'));
    }
    public function store(Request $request)
{
    // Validate the incoming request data
    $request->validate([
        'category_name' => 'required|string|max:255',
        'cimage' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate image
    ]);

    try {
        // Create a new category instance
        $category = new Category();
        $category->category_name = $request->category_name;

        // Check if an image is uploaded
        if ($request->hasFile('cimage')) {
            // Store the image in the public/storage/categories directory
            $path = $request->file('cimage')->store('categories', 'public');
            $category->cimage = $path; // Save the relative path in the database
        }

        // Save the category
        $category->save();

        return redirect()->route('admin.categories')
            ->with('success', 'Category created successfully.');
    } catch (Exception $e) {
        Log::error('Error creating category: ' . $e->getMessage());

        return redirect()->back()
            ->with('error', 'Failed to create category. Please try again.');
    }
}



    public function getCategory(Request $request)
    {
        // Check if the user is authenticated
        if (!$request->user()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $categories = Category::all()->map(function ($category) {
            $category->cimage = $category->cimage ? asset('storage/category_images/' . $category->cimage) : null;
            return $category;
        });
        return response()->json(['categories' => $categories]);
    }

    public function addCategory(Request $request){
        $validator = Validator::make($request->all(), [
            'cimage' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',  
        ]);
        $category = new category();
        $category->category_name = $request->category_name;
        $imageData = base64_decode($validatedData['cimage']);  
        $imageName = time() . '.jpg';
        $imagePath = public_path('storage/category_images/' . $imageName);
        file_put_contents($imagePath, $imageData);
        $catimagepath = 'category_images/' . $imageName;  
        $url = storage::url($catimagepath);
        $category->cimage = $url;
        $category->save();
        return response()->json(['message'=>'category added.'],200);
    }
    
    public function getColors(){
        $color = color::all()->first();
        return response()->json(['color',$color],200);
    }

    public function addColor(Request $request){
        $color= new color();
        $color->name = $request->color_name;
        $color->Hexcode=$request->hexcode;
        $color->save();
        return response()->json(['message'=>'color added!'],200);
    }

    
    public function getSizeitems(Request $request){
        $size_items=null;
        if(!$request->garment_type){
            $size = itemsize::where('size_label',$request->size_label)->where('garment_type',$request->garment_type)->first();
            $size_items =$size->getItems();
        }
        else{
            $size = itemsize::where('size_label',$request->size_label)->where('garment_type',$request->garment_type)->first();
            $size_items =$size->getItems();
        }

        return response()->json(['items',$size_items],200);

    }

   
    
    
}
