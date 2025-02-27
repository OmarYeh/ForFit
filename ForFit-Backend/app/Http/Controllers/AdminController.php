<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\color;
use App\Models\Currency;
use App\Models\item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function showLoginForm()
    {
        return view('admin.login'); 
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        if (Auth::guard('admin')->attempt(array_merge($credentials, ['role_id' => 2]), $request->remember)) {
            return redirect()->route('admin.dashboard');
        }
    
        return back()->withErrors([
            'email' => 'Invalid credentials or not authorized.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    
        return redirect()->route('admin.login');
    }
public function dashboard()
{

    $items = item::select('id', 'item_name', 'price', 'rating', 'description')
                ->get(); 
    $currencies = Currency::all();
    $colors = color::all();
    $categories = Category::all();
    return view('admin.dashboard', compact('items', 'currencies', 'colors', 'categories'));
}
}
