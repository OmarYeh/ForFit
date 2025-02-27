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
use App\Models\saleitem;
use App\Models\sale;
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

class SalesController extends Controller
{

    public function index(){
        $sales = Sale::all();
        $items = item::select('id', 'item_name', 'price', 'rating', 'description')
                ->get(); 
        return view('admin.sales', compact('sales','items'));
    }

    public function getSale($id){
        $sale = Sale::with('saleitems')->findOrFail($id);
        return response()->json($sale, 200);
    }

    public function getAllSales(){
        $sales = Sale::with('saleitems')->get();
        return response()->json($sales, 200);
    }


    public function createSale(Request $request){
        $sale = new sale();
        $sale->start_date =$request->start_date;
        $sale->end_date = $request->end_date;
        $sale->sale_name =$request->sale_name  ;
        $sale->Discount =$request->Discount  ;
        $sale->save();

        return redirect()->route('admin.sales')
        ->with('success', 'sales created successfully.');
    }

    public function UpdateSales(Request $request, $id) {
        $sale = sale::where('id', $id)->first();
        $sale->sale_name = $request->sale_name;
        $sale->Discount = $request->Discount;
        $sale->end_date = $request->end_date;
        $sale->start_date = $request->start_date;
        $existingItemIds = [];
        if($sale->getItems)
        $existingItemIds = $sale->getItems->pluck('id')->toArray();
        
        foreach($request->items as $item) {
            // Check if the item is already associated with the sale
            if (!in_array($item, $existingItemIds)) {
                $saleitem = new saleitem();
                $saleitem->sale_id = $id;
                $saleitem->item_id = $item;
                $saleitem->save();
            }
        }
    
        return redirect()->route('admin.sales')
            ->with('success', 'sales updated successfully.');
    }
    
    public function DeleteSale($id){
        $sale = sale::findOrFail($id);
        $sale->delete();
        return redirect()->route('admin.sales')
        ->with('success', 'sales deleted successfully.');
    }


}
