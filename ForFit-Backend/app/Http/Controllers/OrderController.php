<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\item;
use App\Models\cart;
use App\Models\cartitem;
use App\Models\color;
use App\Models\itemsize;
use App\Models\order;
use App\Models\orderitem;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class OrderController extends Controller
{
    public function Checkout(Request $request){
        $user = Auth::user();
        $address = Address::where('id',$request->shipping_id)->first();
        $order = new order();

        $order->user_id= $user->id;
        $order->total_amount =$request->total_amount;
        $order->status = 'shipping';
        $order->address_id = $address->id;
        $order->DateAdded = now();
        $order->save();
        $cartitems = $user->getCart->getItems()->get();
        foreach($cartitems as $cartitem){
           
            $orderitem = new OrderItem();
            $orderitem->Quantity = $cartitem->pivot->Quantity;
            $orderitem->price = $cartitem->pivot->price;
            $orderitem->total_price= $cartitem->pivot->total_price;
            $orderitem->item_id= $cartitem->pivot->item_id;
            $orderitem->order_id=$order->id;
            $orderitem->color_id=$cartitem->pivot->color_id;
            $orderitem->size_id=$cartitem->pivot->size_id;
           
            $orderitem->save();
           
        }
        $cart = $user->getCart()->first();
        cartitem::where('cart_id', $cart->id)->delete();
        return response()->json(['success',"order added"], 200);
    }
}
