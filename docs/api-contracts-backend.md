# API Contracts - Backend

**Part:** Backend (Laravel API)  
**Base URL:** `/api/v1`  
**Authentication:** Laravel Sanctum (Bearer Token)

## Authentication Endpoints

### Public Routes

#### POST `/api/v1/auth/login`
Login user and receive authentication token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "string"
  },
  "message": "Login successful"
}
```

#### POST `/api/v1/auth/register`
Register new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string",
  "organisation_id": "integer"
}
```

**Response:** `201 Created`

#### POST `/api/v1/auth/forgot-password`
Request password reset link.

#### POST `/api/v1/auth/reset-password`
Reset password with token.

#### POST `/api/v1/auth/verify-email`
Verify user email address.

#### POST `/api/v1/auth/resend-verification`
Resend email verification link.

### Protected Routes (Requires `auth:sanctum`)

#### POST `/api/v1/auth/logout`
Logout current user and invalidate token.

#### POST `/api/v1/auth/refresh`
Refresh authentication token.

## User Endpoints

### GET `/api/v1/users/me`
Get current authenticated user profile.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "integer",
    "name": "string",
    "email": "string",
    "role": "string",
    "organisation": { ... },
    ...
  }
}
```

### PUT `/api/v1/users/me`
Update current user profile.

### PUT `/api/v1/users/me/password`
Change user password.

### POST `/api/v1/users/me/avatar`
Upload user avatar image.

## Activity Endpoints

### GET `/api/v1/activities`
List activities with filtering and pagination.

**Query Parameters:**
- `search` (string): Search in title, description
- `status` (array): Filter by status(es)
- `type` (array): Filter by type(s)
- `organisation` (array): Filter by organisation ID(s)
- `page` (integer): Page number
- `per_page` (integer): Items per page (default: 15)

**Response:** `200 OK` (Paginated)

### POST `/api/v1/activities`
Create new activity.

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "type": "campaign|workshop|training|outreach|research|other (required)",
  "organisation_id": "integer (required)",
  "location": "object (optional)",
  "target_context": "object (optional)",
  "planned_message": "object (optional)",
  "start_date": "date (optional)",
  "end_date": "date (optional)",
  "budget": "decimal (optional)",
  "target_audience": "integer (optional)",
  "priority": "low|medium|high|urgent (optional)",
  "tags": "array (optional)"
}
```

**Response:** `201 Created`

### GET `/api/v1/activities/{id}`
Get single activity with full details.

**Response:** Includes organisation, creator, reviewer, attachments, status history, engagement metrics.

### PUT `/api/v1/activities/{id}`
Update activity (permission check: creator or admin).

### DELETE `/api/v1/activities/{id}`
Delete activity.

### POST `/api/v1/activities/{id}/submit`
Submit activity for approval (status: draft → submitted).

### POST `/api/v1/activities/{id}/approve`
Approve activity (status: submitted → approved).

### POST `/api/v1/activities/{id}/reject`
Reject activity (status: submitted → rejected).

**Request Body:**
```json
{
  "reason": "string (optional)"
}
```

### POST `/api/v1/activities/{id}/complete`
Mark activity as completed (status: approved → completed).

### POST `/api/v1/activities/{id}/duplicate`
Duplicate existing activity.

### POST `/api/v1/activities/{id}/upload-files`
Upload files/attachments to activity.

**Request:** `multipart/form-data`
- `files[]`: Array of files

### DELETE `/api/v1/activities/{id}/files/{fileId}`
Delete activity attachment.

## Organisation Endpoints

### GET `/api/v1/organisations`
List organisations.

### POST `/api/v1/organisations`
Create new organisation.

### GET `/api/v1/organisations/{id}`
Get organisation details.

### PUT `/api/v1/organisations/{id}`
Update organisation.

### DELETE `/api/v1/organisations/{id}`
Delete organisation.

### GET `/api/v1/organisations/{id}/users`
Get organisation members.

### POST `/api/v1/organisations/{id}/invite-members`
Invite users to organisation.

### GET `/api/v1/organisations/{id}/activities`
Get organisation activities.

## Message Endpoints

### GET `/api/v1/messages`
List messages (inbox).

### POST `/api/v1/messages`
Send new message.

### GET `/api/v1/messages/{id}`
Get message details.

### PUT `/api/v1/messages/{id}/read`
Mark message as read.

### POST `/api/v1/messages/{id}/reply`
Reply to message.

### DELETE `/api/v1/messages/{id}`
Delete message.

## Report Endpoints

### GET `/api/v1/reports/templates`
Get available report templates.

### GET `/api/v1/reports`
List reports.

### POST `/api/v1/reports`
Create new report.

### POST `/api/v1/reports/generate`
Generate report with AI assistance.

### GET `/api/v1/reports/{id}`
Get report details.

### PUT `/api/v1/reports/{id}`
Update report.

### DELETE `/api/v1/reports/{id}`
Delete report.

### GET `/api/v1/reports/{id}/export/{format}`
Export report (format: pdf, excel, csv).

## Analytics Endpoints

### GET `/api/v1/analytics/activities/status`
Get activity status breakdown.

### GET `/api/v1/analytics/activities/heatmap`
Get activity heatmap data.

### GET `/api/v1/analytics/engagement`
Get engagement metrics.

### GET `/api/v1/analytics/engagement/trends`
Get engagement trends over time.

### GET `/api/v1/analytics/organisation-comparison`
Compare organisations.

## Dashboard Endpoints

### GET `/api/v1/dashboard/{role}`
Get role-based dashboard data.

**Roles:** `super_admin`, `admin`, `sub_admin`, `user`

### GET `/api/v1/dashboard/summary`
Get dashboard summary.

## AI Endpoints

### POST `/api/v1/ai/semiotic-analyze`
Run semiotic risk analysis on activity message.

**Request Body:**
```json
{
  "activityId": "integer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "riskScore": "float",
    "confidence": "float",
    "predictedFailures": [...],
    "recommendations": [...]
  }
}
```

### POST `/api/v1/ai/generate-report`
Generate AI-powered report.

### GET `/api/v1/ai/insights`
Get AI insights and recommendations.

## Notification Endpoints

### GET `/api/v1/notifications`
List notifications.

### GET `/api/v1/notifications/unread-count`
Get unread notification count.

### PUT `/api/v1/notifications/{id}/read`
Mark notification as read.

### PUT `/api/v1/notifications/read-all`
Mark all notifications as read.

### GET `/api/v1/notifications/preferences`
Get notification preferences.

### PUT `/api/v1/notifications/preferences`
Update notification preferences.

## Help Endpoints

### GET `/api/v1/help/articles`
List help articles.

### GET `/api/v1/help/articles/{id}`
Get help article.

### GET `/api/v1/help/search`
Search help articles.

**Query Parameters:**
- `q`: Search query

### GET `/api/v1/help/categories`
Get help article categories.

## Upload Endpoints

### POST `/api/v1/uploads/single`
Upload single file.

### POST `/api/v1/uploads/multiple`
Upload multiple files.

### POST `/api/v1/uploads/presigned-url`
Get presigned URL for direct S3 upload.

### DELETE `/api/v1/uploads/{id}`
Delete uploaded file.

## System Endpoints

### GET `/api/v1/system/health`
Health check endpoint.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "datetime"
}
```

## Contact Endpoint

### POST `/api/v1/contact`
Submit contact form (public, no auth required).

---

**Total Endpoints:** 62+ endpoints  
**API Version:** v1  
**Response Format:** Standardized JSON with `success`, `data`, `message` structure  
**Error Format:** `{ "success": false, "message": "...", "errors": {...} }`

