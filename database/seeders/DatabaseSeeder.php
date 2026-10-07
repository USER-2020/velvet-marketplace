<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use LogicException;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $email = (string) env('SUPER_ADMIN_EMAIL', 'superadmin@velvet.local');
        $configuredPassword = env('SUPER_ADMIN_PASSWORD');

        if (blank($configuredPassword) && ! app()->environment('local')) {
            throw new LogicException('Define SUPER_ADMIN_PASSWORD antes de ejecutar el seeder fuera de local.');
        }

        $generatedPassword = blank($configuredPassword) ? Str::password(20) : null;
        $user = User::firstOrNew(['email' => $email]);

        if (! $user->exists) {
            $user->name = (string) env('SUPER_ADMIN_NAME', 'Velvet Super Admin');
            $user->password = Hash::make($configuredPassword ?: $generatedPassword);
            $user->country = (string) env('SUPER_ADMIN_COUNTRY', 'CO');
            $user->email_verified_at = now();
        }

        $user->role = UserRole::SuperAdmin;
        $user->is_super_admin = true;
        $user->save();

        if ($generatedPassword) {
            $this->command?->warn("Super admin creado: {$email}");
            $this->command?->warn("Contraseña temporal: {$generatedPassword}");
            $this->command?->warn('Guárdala en SUPER_ADMIN_PASSWORD antes de desplegar.');
        }
    }
}
