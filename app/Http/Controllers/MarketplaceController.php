<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $auditQuery = AuditLog::query()->with('actor:id,name,email')->latest();

        if ($request->filled('audit_action')) $auditQuery->where('event_type', $request->string('audit_action'));
        if ($request->filled('audit_actor')) $auditQuery->where('actor_email', 'like', '%'.$request->string('audit_actor').'%');
        if ($request->filled('audit_ip')) $auditQuery->where('ip_address', 'like', '%'.$request->string('audit_ip').'%');
        if ($request->filled('audit_status')) $auditQuery->where('status_code', $request->integer('audit_status'));
        if ($request->filled('audit_from')) $auditQuery->whereDate('created_at', '>=', $request->string('audit_from'));
        if ($request->filled('audit_to')) $auditQuery->whereDate('created_at', '<=', $request->string('audit_to'));

        return Inertia::render('Marketplace', [
            'user' => $user->only('name', 'email', 'country', 'role', 'created_at'),
            'creators' => [
                ['name' => 'Sofía', 'handle' => '@sofia.ai', 'category' => 'Arte & lifestyle', 'followers' => '12.8K', 'tone' => 'rose'],
                ['name' => 'Valentina', 'handle' => '@valentina.ai', 'category' => 'Moda & conversación', 'followers' => '24.6K', 'tone' => 'violet'],
                ['name' => 'Isabella', 'handle' => '@isabella.v', 'category' => 'Viajes & secretos', 'followers' => '18.4K', 'tone' => 'amber'],
                ['name' => 'Emilia', 'handle' => '@emilia.afterdark', 'category' => 'Música & noches', 'followers' => '9.7K', 'tone' => 'blue'],
            ],
            'packages' => [
                ['name' => 'Básico', 'coins' => 500, 'price' => '4.99', 'bonus' => ''],
                ['name' => 'Starter', 'coins' => 1100, 'price' => '9.99', 'bonus' => '+10%'],
                ['name' => 'Popular', 'coins' => 2300, 'price' => '19.99', 'bonus' => '+15%', 'featured' => true],
                ['name' => 'Pro', 'coins' => 4800, 'price' => '39.99', 'bonus' => '+20%'],
            ],
            'admin' => $user->isSuperAdmin() ? [
                'users' => User::query()->select('id', 'name', 'email', 'country', 'role', 'created_at')->latest()->limit(50)->get()->map(fn (User $account) => [
                    'id' => $account->id, 'name' => $account->name, 'email' => $account->email, 'country' => $account->country,
                    'role' => $account->role?->value ?? UserRole::User->value, 'createdAt' => $account->created_at?->toIso8601String(),
                ]),
                'logs' => $auditQuery->limit(100)->get()->map(fn (AuditLog $log) => [
                    'id' => $log->id, 'name' => $log->actor?->name ?? 'Sistema / visitante', 'email' => $log->actor_email,
                    'action' => $log->action, 'eventType' => $log->event_type, 'routeName' => $log->route_name,
                    'statusCode' => $log->status_code, 'ipAddress' => $log->ip_address, 'device' => $log->device,
                    'context' => $log->context, 'createdAt' => $log->created_at?->toIso8601String(),
                ]),
            ] : null,
        ]);
    }
}
