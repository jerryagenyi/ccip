<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_attachments', function (Blueprint $table) {
            // Add fields to match frontend expectations
            $table->string('name')->nullable()->after('activity_id'); // Frontend expects 'name'
            $table->string('type')->nullable()->after('file_name'); // Frontend expects 'type'
            $table->integer('size')->nullable()->after('file_type'); // Frontend expects 'size'
        });
    }

    public function down(): void
    {
        Schema::table('activity_attachments', function (Blueprint $table) {
            $table->dropColumn(['name', 'type', 'size']);
        });
    }
};
