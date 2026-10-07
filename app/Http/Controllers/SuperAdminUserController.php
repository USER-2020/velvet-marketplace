<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SuperAdminUserController extends Controller
{
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        abort_if($user->is($request->user()), 422, 'No puedes modificar tu propio rol.');

        $data = $request->validate([
            'role' => ['required', Rule::enum(UserRole::class)],
        ]);

        $user->role = UserRole::from($data['role']);
        $user->is_super_admin = $user->role === UserRole::SuperAdmin;
        $user->save();

        return back()->with('success', 'Rol del usuario actualizado.');
    }
}
