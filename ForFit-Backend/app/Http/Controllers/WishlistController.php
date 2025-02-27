<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\item;
use App\Models\wishlist;
use App\Models\wishlistitem;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;


class WishlistController extends Controller
{

  public function getwishlist(){
    $user = Auth::user();
    $wishlist = $user->getWishlist->getItems()->with(['getItempics'])->get();
    return response()->json(['wishlist' => $wishlist], 200);
  }

  public function creatwishlistitem(Request $request){
    $user = Auth::user();
    $item = item::where('id',$request->item_id)->first();
    $wishlist = $user->getWishlist()->first();

    if(!$wishlist){
        $wishlist = new wishlist();
        $wishlist->user_id = $user->id;
        $wishlist->save();
    }
    $wishlistItem = $wishlist->getItems()->where('item_id', $item->id)->first();
    if($wishlistItem ==null){
      $wishlistItem = new wishlistitem();
      $wishlistItem->added_at = now();
      $wishlistItem->wishlist_id = $wishlist->id;
      $wishlistItem->item_id = $item->id;
      $wishlistItem->save();
      return response()->json(['success' => 'Item added to wishlist'], 200);
      }
      return response()->json(['message' => 'Item already exists in the wishlist'], 409);

  }

  public function deletewishlistitem(Request $request){
    $user = Auth::user();
    $item = item::where('id',$request->item_id)->first();
    $wishlist = $user->getWishlist()->first();
    $wishlistItem =wishlistitem::where('item_id',$item->id)->where('wishlist_id',$wishlist->id)->first();
    $wishlistItem->delete();
    return response()->json(['success' => 'Item removed from wishlist'], 200);

  }

  public function clearwishlist(){
    $user = Auth::user();
    $wishlist = $user->getWishlist()->first();
    wishlistitem::where('wishlist_id', $wishlist->id)->delete();
    return response()->json(['success' => 'wishlist cleared'], 200);
  }
}
