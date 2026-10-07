<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAgeVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->has('age_verified_at')) {
            return to_route('age-gate.create');
        }

        if (! Auth::check()) {
            return to_route('login');
        }

        return $next($request);
    }
}
