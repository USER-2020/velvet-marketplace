<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\EnsureAgeVerified;
use App\Http\Middleware\EnsureSuperAdmin;
use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\AuditPlatformActivity;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'age.verified' => EnsureAgeVerified::class,
            'super.admin' => EnsureSuperAdmin::class,
            'role' => EnsureRole::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AuditPlatformActivity::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
