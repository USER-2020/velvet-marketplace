<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    protected $fillable = ['actor_id', 'actor_email', 'event_type', 'action', 'subject_type', 'subject_id', 'route_name', 'method', 'status_code', 'ip_address', 'device', 'user_agent', 'context'];

    protected function casts(): array
    {
        return ['context' => 'array'];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
