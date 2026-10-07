<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CreatorRoleController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user?->hasRole(UserRole::User), 403);

        $user->role = UserRole::Creator;
        $user->save();

        return back()->with('success', 'Tu cuenta ahora es de creador.');
    }
}
