<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    /**
     * Display a listing of the user's addresses.
     */
    public function index()
    {
        $addresses = Auth::user()->addresses;
        return response()->json($addresses);
    }

    /**
     * Store a newly created address in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'address' => 'required|string|max:255',
            'zip_code' => 'required|integer',
            'country' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:15',
        ]);
    
        $address = Address::create([
            'address' => $request->address,
            'zip_code' => $request->zip_code,
            'country' => $request->country,
            'city' => $request->city,
            'phone' => $request->phone,
            'user_id' => Auth::id(),
        ]);
    
        return response()->json(['message' => 'Address added successfully', 'address' => $address], 201);
    }
    
    public function update(Request $request, $id)
    {
        $address = Auth::user()->addresses()->find($id);
    
        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }
    
        $request->validate([
            'address' => 'required|string|max:255',
            'zip_code' => 'required|integer',
            'country' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:15',
        ]);
    
        $address->update($request->all());
    
        return response()->json(['message' => 'Address updated successfully', 'address' => $address]);
    }
    
    public function show($id)
    {
        $address = Auth::user()->addresses()->find($id);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        return response()->json($address);
    }

    /**
     * Remove the specified address from storage.
     */
    public function destroy($id)
    {
        $address = Auth::user()->addresses()->find($id);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }
}
