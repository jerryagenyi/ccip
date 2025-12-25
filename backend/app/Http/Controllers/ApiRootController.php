<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ApiRootController extends Controller
{
    /**
     * Get API information and available endpoints.
     * Returns a friendly, informative response about the API.
     */
    public function index(): JsonResponse
    {
        // Get system status with caching for performance
        $status = Cache::remember('api:status', 60, function () {
            return [
                'healthy' => true,
                'timestamp' => now()->toIso8601String(),
                'timezone' => config('app.timezone'),
                'version' => config('app.version', '1.0.0'),
            ];
        });

        return response()->json([
            'name' => 'CCIP API',
            'description' => 'Crisis Communication Intelligence Platform API',
            'tagline' => 'Empowering public health crisis management in low-bandwidth environments',
            'status' => $status,
            'api' => [
                'version' => 'v1',
                'base_url' => '/api/v1',
                'format' => 'JSON',
            ],
            'endpoints' => [
                'auth' => [
                    'base' => '/api/v1/auth',
                    'description' => 'Authentication and user management',
                    'public' => [
                        'POST /login' => 'User login',
                        'POST /register' => 'User registration',
                        'POST /forgot-password' => 'Request password reset',
                        'POST /reset-password' => 'Reset password with token',
                        'POST /verify-email' => 'Verify email address',
                        'POST /resend-verification' => 'Resend verification email',
                    ],
                    'protected' => [
                        'POST /logout' => 'User logout',
                        'POST /refresh' => 'Refresh authentication token',
                    ],
                ],
                'system' => [
                    'health' => '/api/v1/system/health',
                    'description' => 'System health check endpoint',
                ],
                'public' => [
                    'contact' => [
                        'endpoint' => '/api/v1/contact',
                        'method' => 'POST',
                        'description' => 'Submit contact form (public, no auth required)',
                    ],
                ],
                'resources' => [
                    'activities' => '/api/v1/activities',
                    'organisations' => '/api/v1/organisations',
                    'messages' => '/api/v1/messages',
                    'reports' => '/api/v1/reports',
                    'analytics' => '/api/v1/analytics',
                    'dashboard' => '/api/v1/dashboard',
                    'notifications' => '/api/v1/notifications',
                    'uploads' => '/api/v1/uploads',
                    'help' => '/api/v1/help',
                ],
            ],
            'authentication' => [
                'type' => 'Token-based (Laravel Sanctum)',
                'header' => 'Authorization: Bearer {token}',
                'docs' => 'See /api/v1/auth for authentication endpoints',
            ],
            'links' => [
                'api_base' => url('/api/v1'),
                'health' => url('/api/v1/system/health'),
                'documentation' => 'See API documentation for detailed endpoint information',
            ],
            'contact' => [
                'name' => 'CCIP Support',
                'description' => 'For API support and inquiries',
            ],
        ], 200, [
            'Cache-Control' => 'max-age=300', // Cache for 5 minutes
            'X-API-Version' => 'v1',
        ]);
    }

    /**
     * Health check endpoint for monitoring tools.
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'service' => 'CCIP API',
            'version' => config('app.version', '1.0.0'),
        ]);
    }
}
