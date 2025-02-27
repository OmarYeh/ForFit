<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\item;
use App\Models\cart;
use App\Models\cartitem;
use App\Models\color;
use App\Models\itemsize;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class CartController extends Controller
{
    public function getCart(){
        $user = Auth::user();
        $cartitems = $user->getCart->getItems()->with(['getItempics'])->get();
        $totalprice = 0;
        $cartitems->each(function($cartitem) use (&$totalprice) {
            $color = color::where('id',$cartitem->pivot->color_id)->get(); 
            $size = itemsize::where('id',$cartitem->pivot->size_id)->get();
            
            $cartitem->color = $color;
            $cartitem->size = $size;
            $totalprice += $cartitem->pivot->total_price; 
        });
       
        return response()->json(['cart' => $cartitems,"totalprice"=>$totalprice], 200);
    }

    public function createCartItem(Request $request){
        $user = Auth::user();
        $item = Item::where('id', $request->item_id)->first();
        $sale = $item->getSales()->first();
        $cart = $user->getCart()->first();
        $price = $item->price;

        if ($sale) {  
            $price = number_format($price * (1 - ($sale->Discount / 100)), 2, '.', '');
        }
        
        if (!$cart) {
            $cart = new Cart();
            $cart->user_id = $user->id;
            $cart->save();
        }
    
        // Check if an item with the same item_id, color_id, size_id, and price exists
        $cartitem = CartItem::where('cart_id', $cart->id)
            ->where('item_id', $request->item_id)
            ->where('color_id', $request->color_id)
            ->where('size_id', $request->size_id)
            ->where('price', $price)
            ->first();

        if ($cartitem) {
            // If exists, update quantity and total price
            $cartitem->Quantity += $request->quantity;
            $cartitem->total_price = $cartitem->Quantity * $cartitem->price;
            $cartitem->save();
            return response()->json(['success' => "Cart item updated"], 200);
        }
    
        // If not, create a new entry
        $cartitem = new CartItem();
        $cartitem->cart_id = $cart->id;
        $cartitem->item_id = $item->id;
        $cartitem->Quantity = $request->quantity;
        $cartitem->price = $price;
        $cartitem->total_price = $request->quantity * $price;
        $cartitem->color_id = $request->color_id;
        $cartitem->size_id = $request->size_id;
        $cartitem->save();
    
        return response()->json(['success' => "Cart item added"], 200);
    }
    
    public function updateCartItemQuantity(Request $request)
{
    $request->validate([
        'item_id' => 'required|exists:cartitems,item_id',
        'quantity' => 'required|integer|min:1'
    ]);

    $user = Auth::user();
    $cart = $user->getCart()->first();

    if (!$cart) {
        return response()->json(['error' => 'Cart not found'], 404);
    }

    $cartitem = cartitem::where('cart_id', $cart->id)
        ->where('item_id', $request->item_id)
        ->first();

    if (!$cartitem) {
        return response()->json(['error' => 'Cart item not found'], 404);
    }

    $cartitem->Quantity = $request->quantity;
    $cartitem->total_price = $cartitem->Quantity * $cartitem->price;
    $cartitem->save();

    return response()->json(['success' => 'Cart item updated', 'cartitem' => $cartitem], 200);
}


public function deleteCartItem(Request $request)
{
    $user = Auth::user();
    $cart = $user->getCart()->first();

    // Use the cartItems() relationship instead of items()
    $cartItem = $cart->cartItems()->where('item_id', $request->item_id)->first();

    if (!$cartItem) {
        return response()->json(['message' => 'Cart item not found'], 404);
    }

    $cartItem->delete();

    return response()->json(['message' => 'Cart item deleted'], 200);
}



    public function clearCart(){
        $user = Auth::user();
        $cart = $user->getCart()->first();
        cartitem::where('cart_id', $cart->id)->delete();
        return response()->json(['message' => 'cartitems cleared'], 200);
    }
}
