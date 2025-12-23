<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pattern_contexts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pattern_id');

            // Geographic Context
            $table->string('region')->nullable();
            $table->string('country', 2)->nullable(); // ISO country code
            $table->enum('administrative_level', ['national', 'state', 'lga', 'community'])->nullable();

            // Demographic Context
            $table->json('target_audience')->nullable();
            $table->string('language', 10)->nullable(); // ISO language code
            $table->json('cultural_context')->nullable();

            // Communication Context
            $table->enum('channel', ['radio', 'social_media', 'print', 'community_meeting', 'tv', 'sms', 'other'])->nullable();
            $table->string('communication_goal', 100)->nullable();

            // Reliability
            $table->decimal('reliability_score', 5, 2)->default(50.0);
            $table->integer('sample_size')->nullable();

            $table->timestamps();

            // Foreign key relationship
            $table->foreign('pattern_id')->references('id')->on('semiotic_patterns')->onDelete('cascade');

            // Indexes
            $table->index(['pattern_id', 'country']);
            $table->index(['channel', 'communication_goal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pattern_contexts');
    }
};