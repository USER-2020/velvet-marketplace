<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creator_profile_id')->constrained()->cascadeOnDelete();
            $table->string('title', 160);
            $table->text('description')->nullable();
            $table->string('content_type', 30)->index();
            $table->string('visibility', 20)->default('public')->index();
            $table->unsignedInteger('coin_price')->nullable();
            $table->string('preview_path')->nullable();
            $table->string('asset_path')->nullable();
            $table->string('status', 20)->default('draft')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();

            $table->index(['creator_profile_id', 'status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_items');
    }
};
