<?php

namespace App\Http\Controllers;

use App\Models\RegistrationLog;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminLogController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('SuperAdminLogs', [
            'logs' => RegistrationLog::query()->with('user:id,name,email')->latest()->paginate(50)->through(fn (RegistrationLog $log) => [
                'id' => $log->id,
                'name' => $log->user?->name,
                'email' => $log->user?->email,
                'ipAddress' => $log->ip_address,
                'device' => $log->device,
                'createdAt' => $log->created_at?->toIso8601String(),
            ]),
        ]);
    }
}
