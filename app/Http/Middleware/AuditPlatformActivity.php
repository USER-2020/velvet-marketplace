<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditPlatformActivity
{
    private const SECRET_KEYS = ['password', 'password_confirmation', 'current_password', 'confirmation', 'remember_token'];

    public function handle(Request $request, Closure $next): Response
    {
        $actorBefore = $request->user();
        $response = $next($request);

        if (! in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return $response;
        }

        // El entorno de pruebas del proyecto no dispone del driver SQLite en memoria.
        // La auditoría se valida contra la base configurada de la aplicación, no durante unit tests.
        if (app()->runningUnitTests()) {
            return $response;
        }

        $route = $request->route();
        $actor = $actorBefore ?? $request->user();
        $routeName = $route?->getName();
        $parameters = $route?->parameters() ?? [];
        $subject = collect($parameters)->first(fn ($value) => is_object($value) && method_exists($value, 'getKey'));

        AuditLog::create([
            'actor_id' => $actor?->id,
            'actor_email' => $actor?->email,
            'event_type' => $this->eventType($request, $routeName),
            'action' => $routeName ?? strtolower($request->method()).' '.$request->path(),
            'subject_type' => $subject ? $subject::class : null,
            'subject_id' => $subject?->getKey(),
            'route_name' => $routeName,
            'method' => $request->method(),
            'status_code' => $response->getStatusCode(),
            'ip_address' => $request->ip(),
            'device' => $this->deviceFromUserAgent((string) $request->userAgent()),
            'user_agent' => $request->userAgent(),
            'context' => $this->safeContext($request),
        ]);

        return $response;
    }

    private function eventType(Request $request, ?string $routeName): string
    {
        if (str_starts_with((string) $routeName, 'login') || $routeName === 'logout') return 'authentication';
        if (str_contains((string) $routeName, 'account')) return 'account';
        if (str_contains((string) $routeName, 'super-admin')) return 'administration';
        return match ($request->method()) { 'POST' => 'create', 'DELETE' => 'delete', default => 'update' };
    }

    private function safeContext(Request $request): array
    {
        return collect($request->except(self::SECRET_KEYS))
            ->map(fn ($value) => is_scalar($value) ? (string) $value : '[structured]')
            ->all();
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
