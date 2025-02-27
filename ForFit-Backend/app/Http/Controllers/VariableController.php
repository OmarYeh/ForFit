<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class VariableController extends Controller
{
    public function getVariable()
    {
        $value = Cache::get('shared_variable', 'Default Value'); 
        return response()->json(['variable' => $value]);
    }

    public function updateVariable(Request $request)
    {
        $request->validate(['value' => 'required|string']);
        Cache::put('shared_variable', $request->value, 3600);
        return response()->json(['message' => 'Variable updated!', 'new_value' => $request->value]);
    }
}
