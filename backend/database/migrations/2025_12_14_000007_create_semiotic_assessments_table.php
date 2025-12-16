<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('semiotic_assessments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Assessment Request
            $table->text('message_content');
            $table->jsonb('target_context');
            $table->jsonb('planned_message');

            // Assessment Results
            $table->jsonb('risk_factors')->nullable();
            $table->jsonb('mitigation_strategies')->nullable();
            $table->jsonb('recommended_alternatives')->nullable();
            $table->decimal('overall_risk_score', 5, 2)->nullable();
            $table->enum('risk_level', ['low', 'medium', 'high', 'critical'])->nullable();

            // Matched Patterns
            $table->jsonb('matched_patterns')->default('[]');
            $table->integer('total_patterns_matched')->default(0);
            $table->integer('high_risk_patterns')->default(0);

            // Metadata
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->text('assessment_notes')->nullable();
            $table->jsonb('assessment_metadata')->default('{}');

            $table->timestamps();

            // Indexes
            $table->index(['activity_id', 'risk_level']);
            $table->index(['overall_risk_score']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('semiotic_assessments');
    }
};