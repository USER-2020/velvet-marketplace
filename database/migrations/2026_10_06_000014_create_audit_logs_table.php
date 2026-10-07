<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('actor_email')->nullable();
            $table->string('event_type', 32)->index();
            $table->string('action', 120)->index();
            $table->nullableMorphs('subject');
            $table->string('route_name')->nullable()->index();
            $table->string('method', 10);
            $table->unsignedSmallInteger('status_code')->index();
            $table->ipAddress('ip_address')->nullable()->index();
            $table->string('device', 40)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('context')->nullable();
            $table->timestamps();
            $table->index(['created_at', 'event_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
