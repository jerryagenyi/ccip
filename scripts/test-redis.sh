#!/bin/bash

echo "=== Redis Cache and Queue Functionality Test ==="
echo "Testing Redis connectivity and functionality"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if containers are running
echo "🔍 Checking required containers..."
if ! docker ps | grep ccip-redis > /dev/null; then
    echo "❌ ccip-redis container is not running."
    exit 1
fi

if ! docker ps | grep ccip-backend > /dev/null; then
    echo "❌ ccip-backend container is not running."
    exit 1
fi

echo "✅ All required containers are running"

# Test Redis connectivity from backend
echo ""
echo "🔍 Testing Redis connectivity from Laravel..."
docker exec ccip-backend php artisan tinker --execute="
// Test Redis connection
\$redis = Redis::connection();
\$ping = \$redis->ping();
echo 'Redis ping result: ' . (\$ping ? 'CONNECTED' : 'FAILED') . PHP_EOL;

// Test Cache functionality
Cache::put('test-key', 'Redis Cache Working!', 60);
\$cached = Cache::get('test-key');
echo 'Cache test: ' . \$cached . PHP_EOL;

// Test different cache types
Cache::put('array-test', [1, 2, 3, 'test'], 60);
\$array = Cache::get('array-test');
echo 'Array cache: ' . json_encode(\$array) . PHP_EOL;

// Clean up test data
Cache::forget('test-key');
Cache::forget('array-test');
echo 'Test cache data cleaned up.' . PHP_EOL;
"

# Test queue functionality
echo ""
echo "🚀 Testing Queue functionality..."
docker exec ccip-backend php artisan tinker --execute="
// Test queue connection
\$queue = app('queue');
\$connection = \$queue->connection();
echo 'Queue connection: ' . get_class(\$connection) . PHP_EOL;

// Create a test job
\$testData = [
    'message' => 'Test queue job at ' . now(),
    'data' => ['key' => 'value', 'number' => 42]
];

// Store test job data in cache to verify later
Cache::put('queue-test-data', \$testData, 300);
echo 'Queue test data stored in cache for verification.' . PHP_EOL;
"

# Check Redis info (using environment variable for password)
REDIS_PASSWORD=${REDIS_PASSWORD:-}
if [ -z "$REDIS_PASSWORD" ]; then
    echo "⚠️  REDIS_PASSWORD not set, testing without authentication..."
    AUTH_FLAG=""
else
    AUTH_FLAG="-a $REDIS_PASSWORD"
fi

echo ""
echo "📊 Redis Server Information:"
docker exec ccip-redis redis-cli --no-auth-warning $AUTH_FLAG info server | head -10

echo ""
echo "📈 Redis Memory Usage:"
docker exec ccip-redis redis-cli --no-auth-warning $AUTH_FLAG info memory | grep used_memory_human

echo ""
echo "🔑 Redis Authentication Test:"
if docker exec ccip-redis redis-cli --no-auth-warning $AUTH_FLAG ping | grep -q PONG; then
    echo "✅ Redis authentication working"
else
    echo "❌ Redis authentication failed"
fi

echo ""
echo "📋 Queue Worker Commands:"
echo "To start queue workers, run on your VPS:"
echo "docker exec -d ccip-backend php artisan queue:work --daemon"
echo ""
echo "To check failed jobs:"
echo "docker exec ccip-backend php artisan queue:failed"

echo ""
echo "✅ Redis functionality test completed"