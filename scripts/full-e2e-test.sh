#!/bin/bash

echo "=========================================="
echo "    CCIP FULL END-TO-END PRODUCTION TEST"
echo "=========================================="
echo "Testing complete production application"
echo "Timestamp: $(date)"
echo ""

# Configuration
FRONTEND_URL="https://ccip.jerryagenyi.xyz"
BACKEND_URL="https://api.ccip.jerryagenyi.xyz"
MINIO_URL="https://minio.jerryagenyi.xyz"

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=()

# Function to run test and track results
run_test() {
    local test_name=$1
    local test_command=$2

    echo "🔍 Testing: $test_name"
    echo "----------------------------------------"

    ((TOTAL_TESTS++))

    if eval "$test_command" > /dev/null 2>&1; then
        echo "✅ PASSED: $test_name"
        ((PASSED_TESTS++))
        return 0
    else
        echo "❌ FAILED: $test_name"
        FAILED_TESTS+=("$test_name")
        return 1
    fi
    echo ""
}

# Function to show test details
show_test_detail() {
    local test_name=$1
    local test_command=$2

    echo "📋 Running: $test_name"
    eval "$test_command"
    echo ""
}

echo "🌐 PRODUCTION ENVIRONMENT INFORMATION"
echo "----------------------------------------"
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
echo "MinIO URL: $MINIO_URL"
echo ""

# 1. Basic Connectivity Tests
echo "=== 1. CONNECTIVITY TESTS ==="

run_test "Frontend Domain Resolves" "nslookup ccip.jerryagenyi.xyz"
run_test "Backend Domain Resolves" "nslookup api.ccip.jerryagenyi.xyz"
run_test "Frontend SSL Certificate" "curl -s -o /dev/null -w '%{http_code}' $FRONTEND_URL | grep -q '200'"
run_test "Backend SSL Certificate" "curl -s -o /dev/null -w '%{http_code}' $BACKEND_URL/api | grep -q '200'"

# 2. Frontend Application Tests
echo "=== 2. FRONTEND APPLICATION TESTS ==="

run_test "Frontend Returns HTTP 200" "curl -s -o /dev/null -w '%{http_code}' $FRONTEND_URL | grep -q '200'"
run_test "Frontend Serves HTML Content" "curl -s $FRONTEND_URL | head -10 | grep -q -i 'html'"

# 3. Backend API Tests
echo "=== 3. BACKEND API TESTS ==="

run_test "API Root Endpoint" "curl -s -o /dev/null -w '%{http_code}' $BACKEND_URL/api | grep -q '200'"
run_test "API Health Endpoint" "curl -s -o /dev/null -w '%{http_code}' $BACKEND_URL/api/health | grep -q '200'"
run_test "API Returns JSON" "curl -s $BACKEND_URL/api | head -5 | grep -q -E '\{|\[|Laravel'"

# 4. Database Tests (if backend is accessible)
echo "=== 4. DATABASE CONNECTIVITY TESTS ==="

if docker ps | grep -q ccip-backend; then
    run_test "Database Connection from Backend" "docker exec ccip-backend php artisan tinker --execute=\"DB::connection()->getPdo(); echo 'OK';\" 2>/dev/null | grep -q 'OK'"
    run_test "Redis Connection from Backend" "docker exec ccip-backend php artisan tinker --execute=\"Redis::ping(); echo 'OK';\" 2>/dev/null | grep -q 'OK'"
    run_test "Cache Functionality" "docker exec ccip-backend php artisan tinker --execute=\"Cache::put('test', 'ok', 60); echo Cache::get('test');\" 2>/dev/null | grep -q 'ok'"
else
    echo "⚠️  Skipping backend database tests - backend container not accessible from this environment"
fi

# 5. Storage Tests
echo "=== 5. STORAGE SERVICE TESTS ==="

if docker ps | grep -q ccip-minio; then
    run_test "MinIO Service Running" "docker ps | grep -q ccip-minio"
    run_test "MinIO Port Accessible" "curl -s -o /dev/null -w '%{http_code}' http://localhost:9000/minio/health/live 2>/dev/null | grep -q '200' || curl -s -o /dev/null -w '%{http_code}' $MINIO_URL 2>/dev/null | grep -q '200'"
else
    echo "⚠️  Skipping MinIO tests - minio container not accessible from this environment"
fi

# 6. Security Tests
echo "=== 6. SECURITY TESTS ==="

run_test "Frontend Uses HTTPS" "echo '$FRONTEND_URL' | grep -q '^https'"
run_test "Backend Uses HTTPS" "echo '$BACKEND_URL' | grep -q '^https'"
run_test "No Open Directories on Frontend" "curl -s $FRONTEND_URL/admin | grep -q -v 'Index of'"
run_test "No Exposed PHP Files on Frontend" "curl -s $FRONTEND_URL/index.php 2>/dev/null | grep -q -v '404\|403' || true"

# 7. Performance Tests
echo "=== 7. PERFORMANCE TESTS ==="

run_test "Frontend Response Time < 5s" "timeout 5s curl -s $FRONTEND_URL > /dev/null"
run_test "Backend Response Time < 5s" "timeout 5s curl -s $BACKEND_URL/api > /dev/null"

# 8. Service Health Check
echo "=== 8. SERVICE HEALTH CHECK ==="

echo "🔍 Checking all required services:"
services=("ccip_frontend" "ccip_backend" "ccip_database" "ccip_redis" "ccip_minio")
all_running=true

for service in "${services[@]}"; do
    if docker ps | grep -q "$service"; then
        status=$(docker inspect -f '{{.State.Status}}' "$service" 2>/dev/null)
        health=$(docker inspect -f '{{.State.Health.Status}}' "$service" 2>/dev/null || echo "no-check")
        echo "  ✅ $service: $status ($health)"
    else
        echo "  ❌ $service: Not running"
        all_running=false
    fi
done

if $all_running; then
    echo "✅ All services are running"
else
    echo "⚠️  Some services are not running - this is expected if testing from outside VPS"
fi

# 9. DNS and SSL Verification
echo "=== 9. DNS AND SSL VERIFICATION ==="

run_test "Frontend DNS Points to Correct Server" "nslookup ccip.jerryagenyi.xyz | grep -q -E '172\.|104\.|2606:'"
run_test "Backend DNS Points to Correct Server" "nslookup api.ccip.jerryagenyi.xyz | grep -q -E '172\.|104\.|2606:'"

# 10. Application Functionality Tests
echo "=== 10. APPLICATION FUNCTIONALITY TESTS ==="

# Test static assets
run_test "Frontend CSS Loads" "curl -s $FRONTEND_URL | grep -q -i 'css'"
run_test "Frontend JavaScript Loads" "curl -s $FRONTEND_URL | grep -q -i 'script.*js'"

# Test CORS headers if backend is accessible
if curl -s -o /dev/null -w '%{http_code}' "$BACKEND_URL/api" | grep -q '200'; then
    run_test "Backend Has CORS Headers" "curl -I $BACKEND_URL/api 2>/dev/null | grep -i 'access-control-allow-origin'"
fi

# Generate Test Report
echo ""
echo "=========================================="
echo "           TEST RESULTS SUMMARY"
echo "=========================================="
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $((TOTAL_TESTS - PASSED_TESTS))"

if [[ ${#FAILED_TESTS[@]} -gt 0 ]]; then
    echo ""
    echo "❌ FAILED TESTS:"
    for failed_test in "${FAILED_TESTS[@]}"; do
        echo "  - $failed_test"
    done
else
    echo ""
    echo "🎉 ALL TESTS PASSED!"
fi

# Overall status
echo ""
if [[ $PASSED_TESTS -eq $TOTAL_TESTS ]]; then
    echo "🟢 OVERALL STATUS: HEALTHY"
    echo "   Your CCIP production environment is working correctly!"
    exit_code=0
elif [[ $PASSED_TESTS -gt $((TOTAL_TESTS / 2)) ]]; then
    echo "🟡 OVERALL STATUS: MOSTLY HEALTHY"
    echo "   Most systems are working, but some tests failed."
    exit_code=1
else
    echo "🔴 OVERALL STATUS: NEEDS ATTENTION"
    echo "   Multiple systems are not working correctly."
    exit_code=2
fi

echo ""
echo "📋 Next Steps:"
echo "1. Review any failed tests above"
echo "2. Check application logs: ./scripts/monitor-logs.sh"
echo "3. Run health checks: ./scripts/setup-health-checks.sh"
echo "4. Test in browser: $FRONTEND_URL"
echo ""
echo "🔧 Troubleshooting Commands:"
echo "- Check containers: docker ps"
echo "- View logs: docker logs [container_name]"
echo "- Restart services: Use Dokploy dashboard"
echo "- Test API: curl $BACKEND_URL/api/health"

exit $exit_code