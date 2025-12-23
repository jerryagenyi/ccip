<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offline_storage', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->json('activity_data')->nullable(); // Complete activity data for offline storage
            $table->json('evidence_files')->nullable(); // Evidence file metadata
            $table->timestamp('sync_attempted_at')->nullable();
            $table->text('sync_error')->nullable();
            $table->integer('sync_attempts')->default(0);
            $table->timestamps();

            // Index for performance
            $table->index(['user_id', 'sync_attempted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offline_storage');
    }
};
