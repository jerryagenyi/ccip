<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            // Add missing fields for frontend compatibility
            $table->string('location')->nullable()->change(); // Change from JSON to string
            $table->string('state')->nullable()->after('location');
            $table->string('lga')->nullable()->after('state');
            $table->decimal('actual_cost', 15, 2)->nullable()->after('budget');
            $table->integer('actual_reach')->nullable()->after('target_audience');
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->after('created_by');
            $table->float('semiotic_risk_score')->nullable()->after('semiotic_assessment');
            $table->json('communication_effectiveness')->nullable()->after('semiotic_risk_score');
            $table->json('semiotic_validation')->nullable()->after('communication_effectiveness');
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropColumn([
                'state',
                'lga',
                'actual_cost',
                'actual_reach',
                'updated_by',
                'semiotic_risk_score',
                'communication_effectiveness',
                'semiotic_validation'
            ]);
            // Revert location back to JSON if needed
            $table->json('location')->nullable()->change();
        });
    }
};
