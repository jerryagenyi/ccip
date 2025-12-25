<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pattern_validations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pattern_id');

            $table->foreignId('validator_id')->constrained('users')->cascadeOnDelete();
            $table->enum('validation_type', ['expert', 'field', 'peer', 'automated'])->default('expert');

            // Validation Details
            $table->decimal('confidence_score', 5, 2);
            $table->text('notes')->nullable();
            $table->boolean('approved')->default(false);

            // Validation Metrics
            $table->decimal('effectiveness_prediction', 5, 2)->nullable();

            $table->timestamp('created_at')->useCurrent();

            // Foreign key relationship
            $table->foreign('pattern_id')->references('id')->on('semiotic_patterns')->onDelete('cascade');

            // Indexes
            $table->index(['pattern_id', 'approved']);
            $table->index(['validator_id', 'validation_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pattern_validations');
    }
};
