<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pattern_evidence', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pattern_id');

            // Source Information
            $table->enum('source_type', ['field_report', 'research', 'expert_opinion', 'case_study']);
            $table->text('source_reference'); // URL, report reference, etc.
            $table->date('source_date')->nullable();

            // Evidence Details
            $table->jsonb('effectiveness_metrics')->default('{}');
            $table->enum('confidence_level', ['high', 'medium', 'low'])->nullable();

            // Processing
            $table->boolean('is_anonymous')->default(true);
            $table->enum('processing_status', ['pending', 'processed', 'error'])->default('pending');

            $table->timestamps();

            // Foreign key relationship
            $table->foreign('pattern_id')->references('id')->on('semiotic_patterns')->onDelete('cascade');

            // Indexes
            $table->index(['pattern_id', 'source_type']);
            $table->index(['processing_status', 'confidence_level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pattern_evidence');
    }
};