<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Color;

class ColorController extends Controller
{

    public function index()
    {
        $colors = Color::all();
        return view('admin.colors', compact('colors'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'Hexcode' => 'required|string|max:7',
        ]);

        Color::create($request->all());

        return redirect()->route('admin.colors')->with('success', 'Color created successfully.');
    }

    public function update(Request $request, Color $color)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'Hexcode' => 'required|string|max:7',
        ]);

        $color->update($request->all());

        return redirect()->route('admin.colors')->with('success', 'Color updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Color $color)
    {
        $color->delete();

        return redirect()->route('admin.colors')->with('success', 'Color deleted successfully.');
    }
}