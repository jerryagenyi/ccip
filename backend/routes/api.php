<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    // Public routes
    Route::prefix('auth')->group(function () {
        Route::post('/login', [App\Http\Controllers\Auth\AuthController::class, 'login']);
        Route::post('/register', [App\Http\Controllers\Auth\AuthController::class, 'register']);
        Route::post('/forgot-password', [App\Http\Controllers\Auth\PasswordResetController::class, 'sendResetLink']);
        Route::post('/reset-password', [App\Http\Controllers\Auth\PasswordResetController::class, 'reset']);
        Route::post('/verify-email', [App\Http\Controllers\Auth\EmailVerificationController::class, 'verify']);
        Route::post('/resend-verification', [App\Http\Controllers\Auth\EmailVerificationController::class, 'resend']);
    });

    // Health check
    Route::get('/system/health', function () {
        return response()->json(['status' => 'ok', 'timestamp' => now()]);
    });

    // Public contact form (no authentication required)
    Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store']);

    // Protected routes
    Route::middleware(['auth:sanctum'])->group(function () {
        // Auth routes
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [App\Http\Controllers\Auth\AuthController::class, 'logout']);
            Route::post('/refresh', [App\Http\Controllers\Auth\AuthController::class, 'refresh']);
        });

        // User routes
        Route::prefix('users')->group(function () {
            Route::get('/me', [App\Http\Controllers\UserController::class, 'me']);
            Route::put('/me', [App\Http\Controllers\UserController::class, 'updateProfile']);
            Route::put('/me/password', [App\Http\Controllers\UserController::class, 'changePassword']);
            Route::post('/me/avatar', [App\Http\Controllers\UserController::class, 'uploadAvatar']);
        });

        // Activities routes
        Route::prefix('activities')->group(function () {
            Route::get('/', [App\Http\Controllers\ActivityController::class, 'index']);
            Route::post('/', [App\Http\Controllers\ActivityController::class, 'store']);
            Route::get('/{id}', [App\Http\Controllers\ActivityController::class, 'show']);
            Route::put('/{id}', [App\Http\Controllers\ActivityController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\ActivityController::class, 'destroy']);
            Route::post('/{id}/submit', [App\Http\Controllers\ActivityController::class, 'submit']);
            Route::post('/{id}/approve', [App\Http\Controllers\ActivityController::class, 'approve']);
            Route::post('/{id}/reject', [App\Http\Controllers\ActivityController::class, 'reject']);
            Route::post('/{id}/complete', [App\Http\Controllers\ActivityController::class, 'complete']);
            Route::post('/{id}/duplicate', [App\Http\Controllers\ActivityController::class, 'duplicate']);
            Route::post('/{id}/upload-files', [App\Http\Controllers\ActivityController::class, 'uploadFiles']);
            Route::delete('/{id}/files/{fileId}', [App\Http\Controllers\ActivityController::class, 'deleteFile']);
        });

        // Organisations routes
        Route::prefix('organisations')->group(function () {
            Route::get('/', [App\Http\Controllers\OrganisationController::class, 'index']);
            Route::post('/', [App\Http\Controllers\OrganisationController::class, 'store']);
            Route::get('/{id}', [App\Http\Controllers\OrganisationController::class, 'show']);
            Route::put('/{id}', [App\Http\Controllers\OrganisationController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\OrganisationController::class, 'destroy']);
            Route::get('/{id}/users', [App\Http\Controllers\OrganisationController::class, 'members']);
            Route::post('/{id}/invite-members', [App\Http\Controllers\OrganisationController::class, 'inviteMembers']);
            Route::get('/{id}/activities', [App\Http\Controllers\OrganisationController::class, 'activities']);
        });

        // Messages routes
        Route::prefix('messages')->group(function () {
            Route::get('/', [App\Http\Controllers\MessageController::class, 'index']);
            Route::post('/', [App\Http\Controllers\MessageController::class, 'store']);
            Route::get('/{id}', [App\Http\Controllers\MessageController::class, 'show']);
            Route::put('/{id}/read', [App\Http\Controllers\MessageController::class, 'markAsRead']);
            Route::post('/{id}/reply', [App\Http\Controllers\MessageController::class, 'reply']);
            Route::delete('/{id}', [App\Http\Controllers\MessageController::class, 'destroy']);
        });

        // Reports routes
        Route::prefix('reports')->group(function () {
            Route::get('/templates', [App\Http\Controllers\ReportController::class, 'templates']);
            Route::get('/', [App\Http\Controllers\ReportController::class, 'index']);
            Route::post('/', [App\Http\Controllers\ReportController::class, 'store']);
            Route::post('/generate', [App\Http\Controllers\ReportController::class, 'generate']);
            Route::get('/{id}', [App\Http\Controllers\ReportController::class, 'show']);
            Route::put('/{id}', [App\Http\Controllers\ReportController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\ReportController::class, 'destroy']);
            Route::get('/{id}/export/{format}', [App\Http\Controllers\ReportController::class, 'export']);
        });

        // Analytics routes
        Route::prefix('analytics')->group(function () {
            Route::get('/activities/status', [App\Http\Controllers\AnalyticsController::class, 'statusBreakdown']);
            Route::get('/activities/heatmap', [App\Http\Controllers\AnalyticsController::class, 'heatmap']);
            Route::get('/engagement', [App\Http\Controllers\AnalyticsController::class, 'engagement']);
            Route::get('/engagement/trends', [App\Http\Controllers\AnalyticsController::class, 'engagementTrends']);
            Route::get('/organisation-comparison', [App\Http\Controllers\AnalyticsController::class, 'organisationComparison']);
        });

        // Dashboard routes
        Route::prefix('dashboard')->group(function () {
            Route::get('/{role}', [App\Http\Controllers\DashboardController::class, 'roleBased']);
            Route::get('/summary', [App\Http\Controllers\DashboardController::class, 'summary']);
        });

        // AI routes
        Route::prefix('ai')->group(function () {
            Route::post('/semiotic-analyze', [App\Http\Controllers\AIController::class, 'semioticAnalyze']);
            Route::post('/generate-report', [App\Http\Controllers\AIController::class, 'generateReport']);
            Route::get('/insights', [App\Http\Controllers\AIController::class, 'insights']);
        });

        // Notifications routes
        Route::prefix('notifications')->group(function () {
            Route::get('/', [App\Http\Controllers\NotificationController::class, 'index']);
            Route::get('/unread-count', [App\Http\Controllers\NotificationController::class, 'unreadCount']);
            Route::put('/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
            Route::put('/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
            Route::get('/preferences', [App\Http\Controllers\NotificationController::class, 'preferences']);
            Route::put('/preferences', [App\Http\Controllers\NotificationController::class, 'updatePreferences']);
        });

        // Help routes
        Route::prefix('help')->group(function () {
            Route::get('/articles', [App\Http\Controllers\HelpController::class, 'articles']);
            Route::get('/articles/{id}', [App\Http\Controllers\HelpController::class, 'article']);
            Route::get('/search', [App\Http\Controllers\HelpController::class, 'search']);
            Route::get('/categories', [App\Http\Controllers\HelpController::class, 'categories']);
        });

        // File upload routes
        Route::prefix('uploads')->group(function () {
            Route::post('/single', [App\Http\Controllers\UploadController::class, 'single']);
            Route::post('/multiple', [App\Http\Controllers\UploadController::class, 'multiple']);
            Route::post('/presigned-url', [App\Http\Controllers\UploadController::class, 'presignedUrl']);
            Route::delete('/{id}', [App\Http\Controllers\UploadController::class, 'destroy']);
        });
    });
});

