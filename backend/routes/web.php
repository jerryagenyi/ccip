<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'CCIP API',
        'version' => '1.0',
        'status' => 'operational',
        'endpoints' => [
            'api' => '/api/v1',
            'documentation' => 'See API documentation for available endpoints'
        ]
    ]);
});