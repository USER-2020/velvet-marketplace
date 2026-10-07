<?php

namespace App\Enums;

enum UserRole: string
{
    case User = 'user';
    case Creator = 'creator';
    case Moderator = 'moderator';
    case Admin = 'admin';
    case SuperAdmin = 'super_admin';

    public function label(): string
    {
        return match ($this) {
            self::User => 'Usuario',
            self::Creator => 'Creador',
            self::Moderator => 'Moderador',
            self::Admin => 'Administrador',
            self::SuperAdmin => 'Super administrador',
        };
    }
}
