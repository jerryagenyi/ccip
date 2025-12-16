<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->index('email');
            $table->index('organisation_id');
            $table->index('role');
        });

        Schema::table('organisations', function (Blueprint $table) {
            $table->index('parent_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['email']);
            $table->dropIndex(['organisation_id']);
            $table->dropIndex(['role']);
        });

        Schema::table('organisations', function (Blueprint $table) {
            $table->dropIndex(['parent_id']);
        });
    }
};
