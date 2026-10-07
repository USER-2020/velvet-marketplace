<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\RegistrationLog;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function createRegistration(Request $request): Response|RedirectResponse
    {
        if (Auth::check()) {
            return to_route('marketplace.index');
        }

        $birthDate = $request->cookie('age_gate_birth_date');

        if (! $request->session()->has('age_verified_at') || ! $birthDate) {
            $request->session()->forget(['age_verified_at', 'age_verification_country']);

            return to_route('age-gate.create');
        }

        return Inertia::render('Register', ['birthDate' => $birthDate]);
    }

    public function storeRegistration(Request $request): RedirectResponse
    {
        $birthDate = $request->cookie('age_gate_birth_date');
        $country = $request->session()->get('age_verification_country');

        abort_unless($request->session()->has('age_verified_at') && $birthDate && $country, 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
            'birth_date' => ['required', 'date', 'before_or_equal:'.CarbonImmutable::today()->subYears(18)->toDateString(), Rule::in([$birthDate])],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'country' => $country,
        ]);

        RegistrationLog::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'device' => $this->deviceFromUserAgent((string) $request->userAgent()),
            'user_agent' => $request->userAgent(),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return to_route('marketplace.index')->withoutCookie('age_gate_birth_date');
    }

    public function createLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return to_route('marketplace.index');
        }

        return Inertia::render('Login');
    }

    public function storeLogin(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'Las credenciales no son correctas.'])->onlyInput('email');
        }

        $request->session()->regenerate();

        return to_route('marketplace.index');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('login');
    }

    private function deviceFromUserAgent(string $userAgent): string
    {
        return match (true) {
            str_contains($userAgent, 'iPad'), str_contains($userAgent, 'Tablet') => 'Tablet',
            str_contains($userAgent, 'Mobile'), str_contains($userAgent, 'Android'), str_contains($userAgent, 'iPhone') => 'Móvil',
            default => 'Escritorio',
        };
    }
}
