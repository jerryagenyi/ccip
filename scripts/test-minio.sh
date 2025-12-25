#!/bin/bash

echo "=== MinIO Storage Service Test ==="
echo "Testing your S3-compatible storage service"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if containers are running
echo "🔍 Checking required containers..."
if ! docker ps | grep ccip-minio > /dev/null; then
    echo "❌ ccip-minio container is not running."
    exit 1
fi

if ! docker ps | grep ccip-backend > /dev/null; then
    echo "❌ ccip-backend container is not running."
    exit 1
fi

echo "✅ All required containers are running"

# Test MinIO connectivity from backend
echo ""
echo "🔍 Testing MinIO connectivity from Laravel..."
docker exec ccip-backend php artisan tinker --execute="
\$result = Storage::put('test-file.txt', 'Hello MinIO!');
echo 'File upload result: ' . (\$result ? 'SUCCESS' : 'FAILED') . PHP_EOL;

\$content = Storage::get('test-file.txt');
echo 'File content: ' . \$content . PHP_EOL;

\$exists = Storage::exists('test-file.txt');
echo 'File exists: ' . (\$exists ? 'YES' : 'NO') . PHP_EOL;

// Clean up test file
Storage::delete('test-file.txt');
echo 'Test file cleaned up.' . PHP_EOL;
"

echo ""
echo "🌐 MinIO Console Access:"
echo "URL: https://minio.jerryagenyi.xyz"
echo "Username: minioadmin"
echo "Password: K2#mN8\$pQ5@xR7w"
echo ""
echo "⚠️  SECURITY NOTE: Consider changing default MinIO credentials!"

echo ""
echo "📊 Storage Test Results:"
echo "✅ MinIO connectivity test completed"
echo "📝 Check output above for detailed results"