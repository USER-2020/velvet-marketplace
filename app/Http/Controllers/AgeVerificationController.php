<?php

namespace App\Http\Controllers;

use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Inertia\Inertia;
use Inertia\Response;

class AgeVerificationController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->session()->has('age_verified_at') && $request->cookie('age_gate_birth_date')) {
            return to_route('register.create');
        }

        $request->session()->forget(['age_verified_at', 'age_verification_country']);

        return Inertia::render('AgeGate');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'birth_date' => ['required', 'date', 'before_or_equal:'.CarbonImmutable::today()->subYears(18)->toDateString()],
            'country' => ['required', 'string', 'size:2', 'alpha'],
            'terms_accepted' => ['accepted'],
        ], [
            'birth_date.before_or_equal' => 'Debes tener al menos 18 años para ingresar.',
            'terms_accepted.accepted' => 'Debes confirmar que eres mayor de edad y aceptar los términos.',
        ]);

        $request->session()->put([
            'age_verified_at' => now()->toIso8601String(),
            'age_verification_country' => strtoupper($data['country']),
        ]);

        return to_route('register.create')->withCookie(Cookie::make(
            'age_gate_birth_date',
            $request->string('birth_date')->toString(),
            30,
            null,
            null,
            config('session.secure'),
            true,
            false,
            'lax',
        ));
    }
}
