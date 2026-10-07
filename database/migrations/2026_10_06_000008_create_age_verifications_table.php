<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('age_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->char('country_code', 2);
            $table->string('method', 30)->default('self_attestation');
            $table->string('provider', 60)->nullable();
            $table->string('provider_reference', 120)->nullable()->unique();
            $table->timestamp('verified_at')->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('age_verifications');
    }
};
