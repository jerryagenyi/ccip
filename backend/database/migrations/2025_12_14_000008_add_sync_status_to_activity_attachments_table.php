<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_attachments', function (Blueprint $table) {
            $table->enum('sync_status', ['synced', 'pending', 'failed'])->default('synced')->after('mime_type');
            $table->timestamp('sync_attempted_at')->nullable()->after('sync_status');
            $table->text('sync_error')->nullable()->after('sync_attempted_at');
        });
    }

    public function down(): void
    {
        Schema::table('activity_attachments', function (Blueprint $table) {
            $table->dropColumn(['sync_status', 'sync_attempted_at', 'sync_error']);
        });
    }
};