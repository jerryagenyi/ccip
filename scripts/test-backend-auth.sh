#!/bin/bash

# Backend Authentication Integration Test Script (Shell version)
# 
# Tests all authentication endpoints for US-001
# 
# Usage:
#   ./scripts/test-backend-auth.sh [BASE_URL]
# 
# Prerequisites:
#   - Backend server running on http://localhost:8000
#   - curl installed

set -e

BASE_URL="${1:-http://localhost:8000}"
API_BASE="${BASE_URL}/api/v1"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
SKIPPED=0

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  CCIP Backend Authentication Integration Tests${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "\nBase URL: ${API_BASE}"
echo -e "Started: $(date -u +"%Y-%m-%dT%H:%M:%SZ")\n"

# Test function
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local token="$5"
    local expected_status="$6"
    
    echo -e "${CYAN}▶${NC} Testing: ${name}"
    
    local headers=(-H "Content-Type: application/json" -H "Accept: application/json")
    if [ -n "$token" ]; then
        headers+=(-H "Authorization: Bearer $token")
    fi
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "${API_BASE}${endpoint}" \
            "${headers[@]}" \
            -d "$data" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "${API_BASE}${endpoint}" \
            "${headers[@]}" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} ${name} - PASSED"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} ${name} - FAILED"
        echo -e "${RED}  Expected status: ${expected_status}, got: ${http_code}${NC}"
        echo -e "${RED}  Response: ${body}${NC}"
        ((FAILED++))
        return 1
    fi
}

# Generate unique test email
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"
TEST_NAME="Test User"

# Test 1: Health Check
test_endpoint "Health Check Endpoint" "GET" "/system/health" "" "" 200

# Test 2: Register New User
REGISTER_DATA="{\"name\":\"${TEST_NAME}\",\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\",\"password_confirmation\":\"${TEST_PASSWORD}\",\"phone_number\":\"+1234567890\"}"
if test_endpoint "POST /auth/register - Valid Registration" "POST" "/auth/register" "$REGISTER_DATA" "" 201; then
    # Extract token from response (simplified - assumes JSON response)
    AUTH_TOKEN=$(echo "$body" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || echo "")
    if [ -z "$AUTH_TOKEN" ]; then
        AUTH_TOKEN=$(echo "$body" | grep -o '"token": *"[^"]*' | sed 's/.*"token": *"\([^"]*\).*/\1/' || echo "")
    fi
    echo -e "  ${GREEN}✓${NC} Token received: ${AUTH_TOKEN:0:20}..."
fi

# Test 3: Register with Invalid Email
INVALID_EMAIL_DATA="{\"name\":\"Test\",\"email\":\"invalid-email\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"
test_endpoint "POST /auth/register - Invalid Email" "POST" "/auth/register" "$INVALID_EMAIL_DATA" "" 422

# Test 4: Register with Mismatched Passwords
MISMATCH_DATA="{\"name\":\"Test\",\"email\":\"test2@example.com\",\"password\":\"password123\",\"password_confirmation\":\"different123\"}"
test_endpoint "POST /auth/register - Password Mismatch" "POST" "/auth/register" "$MISMATCH_DATA" "" 422

# Test 5: Login with Valid Credentials
LOGIN_DATA="{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}"
if test_endpoint "POST /auth/login - Valid Credentials" "POST" "/auth/login" "$LOGIN_DATA" "" 200; then
    # Update token
    AUTH_TOKEN=$(echo "$body" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || echo "")
    if [ -z "$AUTH_TOKEN" ]; then
        AUTH_TOKEN=$(echo "$body" | grep -o '"token": *"[^"]*' | sed 's/.*"token": *"\([^"]*\).*/\1/' || echo "")
    fi
    echo -e "  ${GREEN}✓${NC} Login successful"
fi

# Test 6: Login with Invalid Credentials
INVALID_LOGIN="{\"email\":\"${TEST_EMAIL}\",\"password\":\"wrongpassword\"}"
test_endpoint "POST /auth/login - Invalid Credentials" "POST" "/auth/login" "$INVALID_LOGIN" "" 422

# Test 7: Login with Non-existent User
NONEXISTENT="{\"email\":\"nonexistent@example.com\",\"password\":\"password123\"}"
test_endpoint "POST /auth/login - Non-existent User" "POST" "/auth/login" "$NONEXISTENT" "" 422

# Test 8: Forgot Password
FORGOT_DATA="{\"email\":\"${TEST_EMAIL}\"}"
test_endpoint "POST /auth/forgot-password - Valid Email" "POST" "/auth/forgot-password" "$FORGOT_DATA" "" 200

# Test 9: Forgot Password with Invalid Email
INVALID_FORGOT="{\"email\":\"invalid-email\"}"
test_endpoint "POST /auth/forgot-password - Invalid Email" "POST" "/auth/forgot-password" "$INVALID_FORGOT" "" 422

# Test 10: Logout (if we have a token)
if [ -n "$AUTH_TOKEN" ]; then
    test_endpoint "POST /auth/logout - Authenticated" "POST" "/auth/logout" "" "$AUTH_TOKEN" 200
else
    echo -e "${YELLOW}⊘${NC} POST /auth/logout - Authenticated - SKIPPED (No token)"
    ((SKIPPED++))
fi

# Test 11: Logout without Authentication
test_endpoint "POST /auth/logout - Unauthenticated" "POST" "/auth/logout" "" "" 401

# Test 12: Refresh Token (if we have a token)
if [ -n "$AUTH_TOKEN" ]; then
    # Re-login to get fresh token
    LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE}/auth/login" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d "$LOGIN_DATA")
    AUTH_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || echo "")
    
    if [ -n "$AUTH_TOKEN" ]; then
        test_endpoint "POST /auth/refresh - Authenticated" "POST" "/auth/refresh" "" "$AUTH_TOKEN" 200
    else
        echo -e "${YELLOW}⊘${NC} POST /auth/refresh - Authenticated - SKIPPED (Could not get token)"
        ((SKIPPED++))
    fi
else
    echo -e "${YELLOW}⊘${NC} POST /auth/refresh - Authenticated - SKIPPED (No token)"
    ((SKIPPED++))
fi

# Test 13: Refresh Token without Authentication
test_endpoint "POST /auth/refresh - Unauthenticated" "POST" "/auth/refresh" "" "" 401

# Test 14: Protected Route Access (if we have a token)
if [ -n "$AUTH_TOKEN" ]; then
    # Re-login to get fresh token
    LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE}/auth/login" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d "$LOGIN_DATA")
    AUTH_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || echo "")
    
    if [ -n "$AUTH_TOKEN" ]; then
        test_endpoint "GET /users/me - Authenticated" "GET" "/users/me" "" "$AUTH_TOKEN" 200
    else
        echo -e "${YELLOW}⊘${NC} GET /users/me - Authenticated - SKIPPED (Could not get token)"
        ((SKIPPED++))
    fi
else
    echo -e "${YELLOW}⊘${NC} GET /users/me - Authenticated - SKIPPED (No token)"
    ((SKIPPED++))
fi

# Test 15: Protected Route without Authentication
test_endpoint "GET /users/me - Unauthenticated" "GET" "/users/me" "" "" 401

# Print summary
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
TOTAL=$((PASSED + FAILED + SKIPPED))
echo -e "\nTotal Tests: ${TOTAL}"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo -e "${YELLOW}Skipped: ${SKIPPED}${NC}"
echo -e "\nCompleted: $(date -u +"%Y-%m-%dT%H:%M:%SZ")\n"

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi

