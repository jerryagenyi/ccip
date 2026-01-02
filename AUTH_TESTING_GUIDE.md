# Authentication Workflow - Local Testing Guide

## Prerequisites
✅ Docker services are running:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5433
- Redis: localhost:6379
- MinIO: localhost:9000

## Test Users (from seeder)
- **Super Admin**: `admin@ccip.local` / `password`
- **Admin**: `admin@example.com` / `password`
- **User**: `john@example.com` / `password`
- **User**: `jane@example.com` / `password`
- **Sub Admin**: `subadmin@example.com` / `password`

## Testing Checklist

### 1. Login Flow ✅
**URL**: http://localhost:5173/auth/login

**Test Cases**:
- [ ] Page loads correctly with email and password fields
- [ ] Login with valid credentials (`admin@ccip.local` / `password`)
- [ ] Redirects to dashboard after successful login
- [ ] Shows error message for invalid credentials
- [ ] Shows error for empty fields
- [ ] Shows error for invalid email format
- [ ] "Forgot Password" link works
- [ ] "Create Account" link works

**Expected Behavior**:
- Token stored in localStorage as `auth_token`
- User data stored in Pinia store
- Redirects to `/dashboard` or redirect query param

---

### 2. Registration Flow ✅
**URL**: http://localhost:5173/auth/register

**Test Cases**:
- [ ] Page loads with multi-step form
- [ ] Step 1: Personal Info (name, email, phone)
- [ ] Step 2: Organisation selection/creation
- [ ] Step 3: Password setup with strength indicator
- [ ] Step 4: Review and terms acceptance
- [ ] Form validation works on each step
- [ ] Password strength indicator shows correctly
- [ ] Registration succeeds with valid data
- [ ] Shows error for duplicate email
- [ ] Shows error for weak password
- [ ] Shows error if terms not accepted
- [ ] Redirects to dashboard after registration

**Test Data**:
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "Test1234",
  "password_confirmation": "Test1234",
  "phone_number": "+1234567890",
  "acceptTerms": true
}
```

---

### 3. Forgot Password Flow ✅
**URL**: http://localhost:5173/auth/forgot-password

**Test Cases**:
- [ ] Page loads with email input
- [ ] Submit with valid email shows success message
- [ ] Submit with invalid email format shows error
- [ ] Submit with empty email shows validation error
- [ ] Success message: "If that email address exists, a password reset link has been sent."
- [ ] Redirects to login after 2 seconds (or manual redirect)
- [ ] "Back to Login" button works

**Note**: Since email is not configured, the backend will log a warning but still return success (security best practice).

---

### 4. Reset Password Flow ✅
**URL**: http://localhost:5173/auth/reset-password?token=TOKEN_HERE

**Test Cases**:
- [ ] Page loads with token, email, password, and confirm password fields
- [ ] Token can be extracted from URL query parameter
- [ ] Form validation works
- [ ] Submit with valid token and matching passwords succeeds
- [ ] Shows error for mismatched passwords
- [ ] Shows error for password < 8 characters
- [ ] Shows error for invalid/expired token
- [ ] Success message: "Password reset successfully. Please login."
- [ ] Redirects to login page after success
- [ ] "Back to Login" button works

**Note**: To test this, you'll need a valid reset token. You can:
1. Request password reset for a user
2. Check backend logs for the token (if email not configured)
3. Or use Laravel tinker to generate a token

---

### 5. Logout Flow ⏳
**Test Cases**:
- [ ] Logout button/action clears token from localStorage
- [ ] Logout clears user data from Pinia store
- [ ] Logout invalidates session on backend
- [ ] Redirects to login page after logout
- [ ] Cannot access protected routes after logout

**How to Test**:
1. Login successfully
2. Navigate to dashboard or any protected route
3. Click logout (usually in user menu or header)
4. Verify redirect to login
5. Try accessing `/dashboard` - should redirect to login

---

### 6. Token Refresh ⏳
**Test Cases**:
- [ ] Token auto-refreshes before expiry
- [ ] Manual refresh via API endpoint works
- [ ] New token replaces old token
- [ ] All old tokens are invalidated on refresh

**How to Test**:
- Check browser DevTools Network tab for `/api/v1/auth/refresh` calls
- Or manually call the refresh endpoint with a valid token

---

### 7. Protected Route Guards ⏳
**Test Cases**:
- [ ] Accessing `/dashboard` without auth redirects to `/auth/login?redirect=/dashboard`
- [ ] After login, redirects back to original destination
- [ ] Authenticated users accessing `/auth/login` redirect to dashboard
- [ ] Authenticated users accessing `/auth/register` redirect to dashboard

**Test Routes**:
- `/dashboard`
- `/activities`
- `/profile`
- `/auth/login` (should redirect if authenticated)

---

### 8. Auth Persistence ⏳
**Test Cases**:
- [ ] Token persists after page reload
- [ ] User data is fetched on app initialization
- [ ] User remains authenticated after browser refresh
- [ ] Token is cleared on logout

**How to Test**:
1. Login successfully
2. Refresh the page (F5)
3. Verify still authenticated
4. Check localStorage for `auth_token`
5. Check Network tab for `/api/v1/users/me` call

---

### 9. Change Password ⏳
**Test Cases**:
- [ ] Access change password form (usually in profile/settings)
- [ ] Current password validation works
- [ ] New password validation works (min 8 chars, confirmed)
- [ ] Success message shown on password change
- [ ] Can login with new password
- [ ] Cannot login with old password

**How to Test**:
1. Login with test user
2. Navigate to profile/settings page
3. Find change password section
4. Enter current password, new password, confirm
5. Submit and verify success
6. Logout and login with new password

---

### 10. Error Handling ⏳
**Test Cases**:
- [ ] Network errors show appropriate message
- [ ] 401 errors clear token and redirect to login
- [ ] 422 validation errors show field-specific messages
- [ ] 403 errors show permission denied message
- [ ] 500 errors show generic error message

**Test Scenarios**:
- Disconnect internet and try login
- Use expired token
- Submit invalid data
- Try accessing protected route with invalid token

---

## Quick Test Commands

### Check Backend Health
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/system/health" -UseBasicParsing
```

### Test Login API Directly
```powershell
$body = @{
    email = "admin@ccip.local"
    password = "password"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

### Check Frontend
Open browser: http://localhost:5173

---

## Issues to Watch For

1. **CORS Errors**: Check backend CORS configuration
2. **Token Not Persisting**: Check localStorage in DevTools
3. **Redirect Loops**: Check router guards
4. **API Errors**: Check browser console and network tab
5. **Validation Not Working**: Check form rules in Vue components

---

## Next Steps After Local Testing

Once all tests pass locally:
1. ✅ Create comprehensive E2E test suite
2. ✅ Run E2E tests and ensure 100% pass rate
3. ✅ Push to `dev` branch
4. ✅ Test on dev with `npm run dev`
5. ✅ Use Playwright MCP/Browser MCP for verification
6. ✅ Get approval and merge to `main`

