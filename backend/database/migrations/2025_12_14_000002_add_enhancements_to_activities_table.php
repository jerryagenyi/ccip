<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            // Add effectiveness metrics column
            $table->json('effectiveness_metrics')->nullable()->after('semiotic_assessment');

            // Add GPS location column
            $table->json('gps_location')->nullable()->after('effectiveness_metrics');

            // Add offline sync status
            $table->enum('sync_status', ['synced', 'pending', 'conflict', 'offline_only'])->default('synced')->after('gps_location');

            // Add foreign key for offline storage
            $table->foreignId('local_storage_id')->nullable()->after('sync_status')->constrained('offline_storage')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropForeign(['local_storage_id']);
            $table->dropColumn(['effectiveness_metrics', 'gps_location', 'sync_status', 'local_storage_id']);
        });
    }
};
