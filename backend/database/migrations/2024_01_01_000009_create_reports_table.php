<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['activity-summary', 'performance-analysis', 'impact-assessment', 'semiotic-analysis', 'stakeholder-update', 'research-findings', 'incident-report'])->default('activity-summary');
            $table->enum('status', ['draft', 'generating', 'completed', 'failed'])->default('draft');
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('template_id')->nullable()->constrained('report_templates')->nullOnDelete();
            $table->json('filters')->nullable();
            $table->json('data')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_format')->nullable(); // pdf, excel, csv
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
