<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('semiotic_patterns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('pattern_type', ['language', 'cultural', 'technical', 'demographic', 'regional', 'channel']);
            $table->string('title');
            $table->text('description');

            // Core Pattern Elements
            $table->text('failed_element');
            $table->text('successful_alternative');

            // Context Metadata
            $table->json('context_metadata')->nullable();

            // Evidence & Validation
            $table->json('evidence_sources')->nullable();
            $table->decimal('effectiveness_score', 5, 2)->nullable();
            $table->decimal('confidence_score', 5, 2)->default(50.0);
            $table->integer('usage_count')->default(0);

            // Metadata
            $table->enum('status', ['draft', 'validated', 'deprecated'])->default('draft');
            $table->boolean('is_global')->default(false);
            $table->foreignId('organisation_id')->nullable()->constrained('organisations')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            // Vector embedding for similarity search (Phase 2)
            // Only PostgreSQL with pgvector extension supports vector type
            if (Schema::getConnection()->getDriverName() === 'pgsql') {
                $table->vector('embedding', 1536)->nullable();
            } else {
                // Fallback for MySQL/SQLite - store as JSON (for future migration)
                $table->json('embedding')->nullable();
            }

            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index(['pattern_type', 'status']);
            $table->index(['is_global', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('semiotic_patterns');
    }
};
