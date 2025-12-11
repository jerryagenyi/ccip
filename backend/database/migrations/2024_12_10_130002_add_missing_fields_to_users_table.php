<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add missing fields for frontend compatibility
            $table->string('team')->nullable()->after('is_active');
            $table->string('avatar_id')->nullable()->after('team');
            $table->timestamp('last_login')->nullable()->after('email_verified_at');
            $table->string('status', 20)->default('Active')->after('avatar_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['team', 'avatar_id', 'last_login', 'status']);
        });
    }
};
