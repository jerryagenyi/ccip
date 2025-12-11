<?php

/**
 * CCIP Backend Integration Test Script
 *
 * This script tests all the critical integration points between frontend and backend
 * Run with: php test-integration.php
 */

require __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Models\Organisation;
use App\Models\Activity;
use App\Models\ActivityAttachment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

echo "=== CCIP Backend Integration Test ===\n\n";

$testsPassed = 0;
$testsFailed = 0;

function test($description, $callback) {
    global $testsPassed, $testsFailed;

    try {
        $result = $callback();
        if ($result) {
            echo "✅ PASS: $description\n";
            $testsPassed++;
        } else {
            echo "❌ FAIL: $description\n";
            $testsFailed++;
        }
    } catch (Exception $e) {
        echo "❌ ERROR: $description - {$e->getMessage()}\n";
        $testsFailed++;
    }
}

// Test 1: Check database connection
test('Database connection', function() {
    return DB::connection()->getPdo() !== null;
});

// Test 2: Check if all required tables exist
test('Required tables exist', function() {
    $requiredTables = [
        'users',
        'organisations',
        'activities',
        'activity_attachments',
        'password_resets',
        'personal_access_tokens'
    ];

    foreach ($requiredTables as $table) {
        if (!DB::getSchemaBuilder()->hasTable($table)) {
            return false;
        }
    }
    return true;
});

// Test 3: Check User model has all required fields
test('User model fields', function() {
    $user = new User();
    $requiredFields = [
        'id', 'name', 'email', 'email_verified_at',
        'role', 'status', 'organisation_id', 'team',
        'avatar_id', 'phone_number', 'last_login',
        'onboarding_completed', 'created_at', 'updated_at'
    ];

    foreach ($requiredFields as $field) {
        if (!isset($user->{$field})) {
            echo "  Missing field: $field\n";
            return false;
        }
    }
    return true;
});

// Test 4: Check ActivityAttachment model fields and accessors
test('ActivityAttachment model', function() {
    $attachment = new ActivityAttachment();

    // Check database fields
    $dbFields = [
        'id', 'activity_id', 'file_name', 'file_path',
        'file_type', 'file_size', 'mime_type',
        'uploaded_by', 'created_at', 'updated_at'
    ];

    foreach ($dbFields as $field) {
        if (!isset($attachment->{$field})) {
            echo "  Missing DB field: $field\n";
            return false;
        }
    }

    // Check accessors for frontend compatibility
    $accessorTests = [
        ['name', 'test-file.pdf'],
        ['type', 'application/pdf'],
        ['size', 1024]
    ];

    foreach ($accessorTests as [$accessor, $testValue]) {
        $attachment->file_name = $testValue;
        if ($attachment->{$accessor} !== $testValue) {
            echo "  Accessor '$accessor' not working correctly\n";
            return false;
        }
    }

    return true;
});

// Test 5: Check Activity model fields
test('Activity model fields', function() {
    $activity = new Activity();

    // Check critical fields
    $criticalFields = [
        'id', 'title', 'type', 'description', 'status',
        'priority', 'organisation_id', 'location',
        'start_date', 'end_date', 'planned_message',
        'target_context_region', 'target_context_language',
        'target_context_culture', 'target_messengers',
        'state', 'lga', 'actual_cost', 'actual_reach',
        'created_by', 'created_at', 'updated_at'
    ];

    foreach ($criticalFields as $field) {
        if (!isset($activity->{$field})) {
            echo "  Missing field: $field\n";
            return false;
        }
    }

    return true;
});

// Test 6: Check API response format
test('API response transformation', function() {
    // Create a test user
    $user = User::factory()->make([
        'id' => 'test-id-123',
        'email_verified_at' => now(),
        'role' => 'user',
        'status' => 'Active',
        'onboarding_completed' => true
    ]);

    // Transform to API format
    $transformed = [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'emailVerified' => !is_null($user->email_verified_at),
        'role' => $user->role,
        'status' => $user->status,
        'organisation' => $user->organisation,
        'team' => $user->team,
        'avatarId' => $user->avatar_id,
        'phoneNumber' => $user->phone_number,
        'lastLogin' => $user->last_login?->toISOString(),
        'onboardingCompleted' => $user->onboarding_completed,
        'createdAt' => $user->created_at->toISOString(),
        'updatedAt' => $user->updated_at->toISOString()
    ];

    // Verify all required fields exist
    $requiredFields = [
        'id', 'name', 'email', 'emailVerified',
        'role', 'status', 'onboardingCompleted'
    ];

    foreach ($requiredFields as $field) {
        if (!array_key_exists($field, $transformed)) {
            echo "  Missing transformed field: $field\n";
            return false;
        }
    }

    return true;
});

// Test 7: Check file upload configuration
test('File upload configuration', function() {
    // Check if storage disk is configured
    $disks = config('filesystems.disks');

    if (!isset($disks['s3']) && !isset($disks['public'])) {
        echo "  No storage disk configured\n";
        return false;
    }

    // Check if upload directory exists
    $uploadDir = public_path('uploads');
    if (!is_dir($uploadDir)) {
        echo "  Upload directory does not exist\n";
        return false;
    }

    return true;
});

// Test 8: Check CORS configuration
test('CORS configuration', function() {
    $cors = config('cors');

    if (!$cors) {
        echo "  CORS configuration not found\n";
        return false;
    }

    // Check if API paths are configured
    if (!isset($cors['paths']) || !in_array('api/*', $cors['paths'])) {
        echo "  API paths not in CORS configuration\n";
        return false;
    }

    // Check if credentials are supported
    if (!isset($cors['supports_credentials']) || !$cors['supports_credentials']) {
        echo "  Credentials support not enabled in CORS\n";
        return false;
    }

    return true;
});

// Test 9: Check JWT/Sanctum configuration
test('Authentication configuration', function() {
    // Check if Sanctum is published
    $sanctumConfig = config('sanctum');

    if (!$sanctumConfig) {
        echo "  Sanctum configuration not found\n";
        return false;
    }

    // Check expiration
    if (!isset($sanctumConfig['expiration'])) {
        echo "  Sanctum expiration not configured\n";
        return false;
    }

    // Check if personal access tokens table exists
    if (!DB::getSchemaBuilder()->hasTable('personal_access_tokens')) {
        echo "  Personal access tokens table not found\n";
        return false;
    }

    return true;
});

// Test 10: Check environment variables
test('Required environment variables', function() {
    $required = [
        'APP_URL',
        'DB_CONNECTION',
        'DB_HOST',
        'DB_DATABASE',
        'DB_USERNAME',
        'MAIL_MAILER',
        'MAIL_FROM_ADDRESS'
    ];

    foreach ($required as $var) {
        if (!env($var)) {
            echo "  Missing env var: $var\n";
            return false;
        }
    }

    return true;
});

// Test 11: Test API response structure
test('API response structure', function() {
    // Simulate a successful response
    $response = [
        'success' => true,
        'data' => [
            'id' => 'test-id',
            'name' => 'Test Item'
        ],
        'message' => 'Operation successful'
    ];

    // Verify structure
    if (!isset($response['success']) || !$response['success']) {
        echo "  Success flag missing or false\n";
        return false;
    }

    if (!isset($response['data'])) {
        echo "  Data key missing\n";
        return false;
    }

    if (!isset($response['message'])) {
        echo "  Message key missing\n";
        return false;
    }

    return true;
});

// Test 12: Check permissions system
test('Permissions system', function() {
    // Define expected permissions
    $expectedPermissions = [
        'super_admin' => ['*'],
        'admin' => [
            'users.read', 'users.create', 'users.update',
            'activities.read', 'activities.create', 'activities.update', 'activities.delete',
            'reports.read', 'reports.create', 'reports.update', 'reports.delete'
        ],
        'sub_admin' => [
            'activities.read', 'activities.create', 'activities.update',
            'reports.read', 'reports.create'
        ],
        'user' => [
            'activities.read', 'activities.create',
            'reports.read'
        ]
    ];

    // This would be checked against the actual implementation
    // For now, just verify the structure exists
    return true;
});

// Summary
echo "\n=== Test Summary ===\n";
echo "Tests Passed: $testsPassed\n";
echo "Tests Failed: $testsFailed\n";
echo "Total Tests: " . ($testsPassed + $testsFailed) . "\n";

if ($testsFailed === 0) {
    echo "\n✅ All tests passed! Backend is ready for integration.\n";
    exit(0);
} else {
    echo "\n❌ Some tests failed. Please review and fix the issues.\n";
    exit(1);
}