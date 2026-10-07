<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
    public function updateCredentials(Request $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'current_password' => ['required', 'current_password'],
            'password' => ['nullable', 'confirmed', 'min:8'],
        ]);

        $user->email = $data['email'];
        if (! empty($data['password'])) $user->password = Hash::make($data['password']);
        $user->save();

        return back()->with('success', 'Tus credenciales fueron actualizadas.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'confirmation' => ['required', 'in:ELIMINAR'],
        ]);

        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('age-gate.create')->with('success', 'Tu cuenta fue eliminada.');
    }
}
