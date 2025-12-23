<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['campaign', 'workshop', 'training', 'outreach', 'research', 'other'])->default('campaign');
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'])->default('draft');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->foreignId('organisation_id')->constrained('organisations')->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->json('location')->nullable(); // country, administrative_level_1, administrative_level_2, city
            $table->json('target_context')->nullable(); // region, language, culture
            $table->json('planned_message')->nullable(); // content, channels, messengers, tone, key_messages
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('budget', 15, 2)->nullable();
            $table->integer('target_audience')->nullable();
            $table->json('tags')->nullable();
            $table->json('assignees')->nullable(); // Array of user IDs
            $table->boolean('human_review_completed')->default(false);
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('review_notes')->nullable();
            $table->json('semiotic_assessment')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
