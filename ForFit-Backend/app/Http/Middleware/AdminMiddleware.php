<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (auth('admin')->check() && auth('admin')->user()->role_id == 2) {
            return $next($request);
        }

        return redirect()->route('admin.login')->withErrors(['error' => 'Unauthorized access.']);
    }
}
