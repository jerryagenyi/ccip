# CCIP Laravel API Endpoint Specification

This document provides a comprehensive specification of all API endpoints that the frontend expects the Laravel backend to implement.

## Base Configuration

- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json` (except for file uploads)
- **Authentication**: Bearer token (JWT)
- **Pagination**: Uses `page` and `perPage` query parameters
- **Response Format**:
  ```json
  {
    "success": boolean,
    "data": any,
    "message": string,
    "meta": {
      "total": number,
      "page": number,
      "perPage": number,
      "totalPages": number
    }
  }
  ```

## 1. Authentication Endpoints

### POST /auth/login
- **Description**: User login
- **Request Body**:
  ```json
  {
    "email": string,
    "password": string,
    "remember": boolean (optional)
  }
  ```
- **Response**: User data and JWT token

### POST /auth/register
- **Description**: User registration
- **Request Body**:
  ```json
  {
    "email": string,
    "password": string,
    "password_confirmation": string,
    "name": string,
    "phoneNumber": string (optional),
    "organisation_id": string (optional),
    "acceptTerms": boolean
  }
  ```
- **Response**: User data and JWT token

### POST /auth/logout
- **Description**: User logout
- **Headers**: Authorization Bearer token
- **Response**: Success message

### POST /auth/refresh
- **Description**: Refresh JWT token
- **Headers**: Authorization Bearer token
- **Response**: New JWT token

### POST /auth/forgot-password
- **Description**: Send password reset email
- **Request Body**:
  ```json
  {
    "email": string
  }
  ```
- **Response**: Success message

### POST /auth/reset-password
- **Description**: Reset password with token
- **Request Body**:
  ```json
  {
    "token": string,
    "email": string,
    "password": string,
    "password_confirmation": string
  }
  ```
- **Response**: Success message

### POST /auth/verify-email
- **Description**: Verify email with token
- **Request Body**:
  ```json
  {
    "token": string
  }
  ```
- **Response**: Success message

### POST /auth/resend-verification
- **Description**: Resend email verification
- **Headers**: Authorization Bearer token
- **Response**: Success message

## 2. User Management Endpoints

### GET /users/me
- **Description**: Get current user details
- **Headers**: Authorization Bearer token
- **Response**: User object

### PUT /users/update-profile
- **Description**: Update user profile
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "name": string (optional),
    "phoneNumber": string (optional),
    "bio": string (optional)
  }
  ```
- **Response**: Updated user object

### PUT /users/change-password
- **Description**: Change user password
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "currentPassword": string,
    "password": string,
    "password_confirmation": string
  }
  ```
- **Response**: Success message

### POST /users/upload-avatar
- **Description**: Upload user avatar
- **Headers**:
  - Authorization Bearer token
  - Content-Type: multipart/form-data
- **Request Body**: FormData with file
- **Response**: Updated user object with avatar URL

### GET /users/profile
- **Description**: Get user profile (alias for /users/me)
- **Headers**: Authorization Bearer token
- **Response**: User object

### GET /users/settings
- **Description**: Get user settings
- **Headers**: Authorization Bearer token
- **Response**: User settings object

## 3. Organisation Endpoints

### GET /organisations
- **Description**: List organisations
- **Query Parameters**:
  - `parent_id`: number (optional)
  - `type`: string (optional)
- **Headers**: Authorization Bearer token
- **Response**: Paginated list of organisations

### POST /organisations
- **Description**: Create new organisation
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "name": string,
    "type": "federal" | "state" | "local",
    "parent_id": number (optional),
    "description": string (optional)
  }
  ```
- **Response**: Created organisation

### GET /organisations/{id}
- **Description**: Get organisation details
- **Headers**: Authorization Bearer token
- **Response**: Organisation object

### PUT /organisations/{id}
- **Description**: Update organisation
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "name": string (optional),
    "type": string (optional),
    "parent_id": number (optional),
    "description": string (optional)
  }
  ```
- **Response**: Updated organisation

### DELETE /organisations/{id}
- **Description**: Delete organisation
- **Headers**: Authorization Bearer token
- **Response**: Success message

### GET /organisations/{id}/members
- **Description**: Get organisation members
- **Headers**: Authorization Bearer token
- **Response**: List of user objects

### POST /organisations/{id}/invite-members
- **Description**: Invite members to organisation
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "emails": string[] (optional),
    "csvFile": File (optional),
    "role": string,
    "message": string (optional)
  }
  ```
- **Response**: Success message

### GET /organisations/{id}/activities
- **Description**: Get organisation activities
- **Headers**: Authorization Bearer token
- **Query Parameters**: Same as /activities
- **Response**: Paginated list of activities

### GET /organisations/{id}/users
- **Description**: Get users in organisation (alias for /members)
- **Headers**: Authorization Bearer token
- **Response**: List of user objects

## 4. Activity Endpoints

### GET /activities
- **Description**: List activities with filters
- **Query Parameters**:
  - `page`: number (default: 1)
  - `perPage`: number (default: 10)
  - `search`: string
  - `status`: string[] (comma-separated)
  - `type`: string[] (comma-separated)
  - `organisation`: string[] (comma-separated)
  - `state`: string[] (comma-separated)
  - `lga`: string[] (comma-separated)
  - `priority`: string[] (comma-separated)
  - `assignee`: string[] (comma-separated)
  - `tags`: string[] (comma-separated)
  - `dateFrom`: string (YYYY-MM-DD)
  - `dateTo`: string (YYYY-MM-DD)
  - `sortBy`: string
  - `sortOrder`: "asc" | "desc"
- **Headers**: Authorization Bearer token
- **Response**: Paginated list of activities

### POST /activities
- **Description**: Create new activity
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "title": string,
    "description": string,
    "type": string,
    "organization": string,
    "location": string,
    "state": string,
    "lga": string,
    "targetContext": {
      "region": string,
      "language": string,
      "culture": string
    },
    "plannedMessage": {
      "content": string,
      "channels": string[],
      "messengers": string[],
      "tone": string,
      "keyMessages": string[]
    },
    "startDate": string (ISO 8601, optional),
    "endDate": string (ISO 8601, optional),
    "budget": number (optional),
    "targetAudience": number,
    "priority": string,
    "tags": string[],
    "assignees": string[]
  }
  ```
- **Response**: Created activity

### GET /activities/{id}
- **Description**: Get activity details
- **Headers**: Authorization Bearer token
- **Response**: Activity object with all relations

### PUT /activities/{id}
- **Description**: Update activity
- **Headers**: Authorization Bearer token
- **Request Body**: Same as create activity, all fields optional
- **Response**: Updated activity

### DELETE /activities/{id}
- **Description**: Delete activity
- **Headers**: Authorization Bearer token
- **Response**: Success message

### POST /activities/{id}/submit
- **Description**: Submit activity for review
- **Headers**: Authorization Bearer token
- **Response**: Updated activity with status 'submitted'

### POST /activities/{id}/approve
- **Description**: Approve activity
- **Headers**: Authorization Bearer token
- **Response**: Updated activity with status 'approved'

### POST /activities/{id}/reject
- **Description**: Reject activity
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "reason": string (optional)
  }
  ```
- **Response**: Updated activity with status 'rejected'

### POST /activities/{id}/complete
- **Description**: Mark activity as complete
- **Headers**: Authorization Bearer token
- **Response**: Updated activity with status 'completed'

### POST /activities/{id}/duplicate
- **Description**: Duplicate activity
- **Headers**: Authorization Bearer token
- **Response**: New duplicated activity

### POST /activities/{id}/upload-files
- **Description**: Upload files for activity
- **Headers**:
  - Authorization Bearer token
  - Content-Type: multipart/form-data
- **Request Body**: FormData with files[] array
- **Response**: Array of uploaded file objects

### DELETE /activities/{id}/files/{fileId}
- **Description**: Delete file from activity
- **Headers**: Authorization Bearer token
- **Response**: Success message

## 5. AI Services Endpoints

### POST /ai/semiotic-analyze
- **Description**: Run semiotic analysis on activity
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "activityId": string
  }
  ```
- **Response**: Semiotic assessment object with risk score

### POST /ai/generate-report
- **Description**: Generate AI-powered report
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "title": string,
    "description": string,
    "activityIds": string[],
    "type": string,
    "tone": "professional" | "casual" | "academic",
    "audience": string,
    "includeRecommendations": boolean,
    "includeVisualizations": boolean,
    "customInstructions": string (optional)
  }
  ```
- **Response**: Generated report object

### GET /ai/insights
- **Description**: Get AI insights for activities
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `activityIds`: string[] (optional)
  - `type`: string (optional)
- **Response**: AI insights object

### POST /ai/optimize-message
- **Description**: Optimize message using AI
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "content": string,
    "targetAudience": {
      "region": string,
      "language": string,
      "culture": string
    },
    "tone": string,
    "channels": string[]
  }
  ```
- **Response**: Optimized message suggestions

### POST /ai/predict-outcomes
- **Description**: Predict activity outcomes
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "activityId": string,
    "parameters": object (optional)
  }
  ```
- **Response**: Prediction results with confidence scores

## 6. Reports Endpoints

### GET /reports
- **Description**: List reports with filters
- **Query Parameters**:
  - `page`: number
  - `perPage`: number
  - `search`: string
  - `status`: string[] (comma-separated)
  - `type`: string[] (comma-separated)
  - `period`: string[] (comma-separated)
  - `tags`: string[] (comma-separated)
- **Headers**: Authorization Bearer token
- **Response**: Paginated list of reports

### POST /reports/generate
- **Description**: Generate new report
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "templateId": string,
    "activityIds": string[] (optional),
    "parameters": object (optional),
    "includeVisualizations": boolean,
    "format": "pdf" | "html" | "docx"
  }
  ```
- **Response**: Report generation object with status

### GET /reports/{id}
- **Description**: Get report details
- **Headers**: Authorization Bearer token
- **Response**: Report object

### PUT /reports/{id}
- **Description**: Update report
- **Headers**: Authorization Bearer token
- **Request Body**: Report update object
- **Response**: Updated report

### DELETE /reports/{id}
- **Description**: Delete report
- **Headers**: Authorization Bearer token
- **Response**: Success message

### GET /reports/{id}/export/{format}
- **Description**: Export report in specific format
- **Headers**: Authorization Bearer token
- **Path Parameters**:
  - `format`: "pdf" | "excel" | "json"
- **Response**: File download

### GET /reports/{id}/download
- **Description**: Download report file
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `format`: "pdf" | "html" | "docx" (default: pdf)
- **Response**: File as blob

### GET /reports/templates
- **Description**: List report templates
- **Headers**: Authorization Bearer token
- **Response**: Array of report templates

### POST /reports/create-template
- **Description**: Create new report template
- **Headers**: Authorization Bearer token
- **Request Body**: Report template object
- **Response**: Created template

### PUT /reports/update-template/{id}
- **Description**: Update report template
- **Headers**: Authorization Bearer token
- **Request Body**: Partial template object
- **Response**: Updated template

### DELETE /reports/delete-template/{id}
- **Description**: Delete report template
- **Headers**: Authorization Bearer token
- **Response**: Success message

### POST /reports/schedule
- **Description**: Schedule report generation
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "templateId": string,
    "schedule": string,
    "parameters": object,
    "recipients": string[]
  }
  ```
- **Response**: Created schedule object

### POST /reports/bulk-update
- **Description**: Bulk update reports
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "ids": string[],
    "data": object
  }
  ```
- **Response**: Array of updated reports

## 7. Messages Endpoints

### GET /messages/inbox
- **Description**: Get user's inbox messages
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `page`: number
  - `unread_only`: boolean
- **Response**: Paginated messages

### GET /messages/sent
- **Description**: Get user's sent messages
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `page`: number
- **Response**: Paginated messages

### POST /messages/compose
- **Description**: Compose and send new message
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "recipient_id": number (optional),
    "organisation_id": number (optional),
    "role": string (optional),
    "subject": string,
    "body": string,
    "is_urgent": boolean (optional),
    "parent_message_id": number (optional)
  }
  ```
- **Response**: Created message

### GET /messages/conversations/{id}
- **Description**: Get conversation thread
- **Headers**: Authorization Bearer token
- **Response**: Conversation with messages

### PUT /messages/{id}/read
- **Description**: Mark message as read
- **Headers**: Authorization Bearer token
- **Response**: Success message

### DELETE /messages/{id}
- **Description**: Delete message
- **Headers**: Authorization Bearer token
- **Response**: Success message

### GET /messages
- **Description**: Get all messages (combined inbox/sent)
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `page`: number
  - `unread_only`: boolean
- **Response**: Paginated messages

### GET /messages/{id}
- **Description**: Get single message details
- **Headers**: Authorization Bearer token
- **Response**: Message object

### POST /messages/{id}/reply
- **Description**: Reply to message
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "body": string
  }
  ```
- **Response**: Created reply message

## 8. Notifications Endpoints

### GET /notifications
- **Description**: Get user notifications
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `limit`: number
  - `unread_only`: boolean
- **Response**: Array of notifications

### PUT /notifications/{id}/read
- **Description**: Mark notification as read
- **Headers**: Authorization Bearer token
- **Response**: Success message

### PUT /notifications/mark-all-read
- **Description**: Mark all notifications as read
- **Headers**: Authorization Bearer token
- **Response**: Success message

### GET /notifications/settings
- **Description**: Get notification preferences
- **Headers**: Authorization Bearer token
- **Response**: Notification preferences object

### PUT /notifications/settings
- **Description**: Update notification preferences
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "email": boolean,
    "push": boolean,
    "inApp": boolean,
    "types": string[]
  }
  ```
- **Response**: Updated preferences

### GET /notifications/unread-count
- **Description**: Get unread notifications count
- **Headers**: Authorization Bearer token
- **Response**:
  ```json
  {
    "count": number
  }
  ```

### GET /notifications/preferences
- **Description**: Get detailed notification preferences
- **Headers**: Authorization Bearer token
- **Response**: Detailed preferences object

### PUT /notifications/read-all
- **Description**: Alternative endpoint to mark all as read
- **Headers**: Authorization Bearer token
- **Response**: Success message

## 9. File Upload Endpoints

### POST /uploads/single
- **Description**: Upload single file
- **Headers**:
  - Authorization Bearer token
  - Content-Type: multipart/form-data
- **Request Body**: FormData with file
- **Response**: File object with URL

### POST /uploads/multiple
- **Description**: Upload multiple files
- **Headers**:
  - Authorization Bearer token
  - Content-Type: multipart/form-data
- **Request Body**: FormData with files[] array
- **Response**: Array of file objects

### POST /uploads/presigned-url
- **Description**: Get presigned URL for direct upload
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "filename": string,
    "contentType": string,
    "purpose": string
  }
  ```
- **Response**: Presigned URL object

### DELETE /uploads/{id}
- **Description**: Delete uploaded file
- **Headers**: Authorization Bearer token
- **Response**: Success message

## 10. Dashboard Endpoints

### GET /dashboard/metrics
- **Description**: Get dashboard metrics
- **Headers**: Authorization Bearer token
- **Response**: Dashboard metrics object

### GET /dashboard/activity-summary
- **Description**: Get activity summary for dashboard
- **Headers**: Authorization Bearer token
- **Response**: Activity summary object

### GET /dashboard/performance
- **Description**: Get performance metrics
- **Headers**: Authorization Bearer token
- **Response**: Performance metrics object

### GET /dashboard/recent-activities
- **Description**: Get recent activities for dashboard
- **Headers**: Authorization Bearer token
- **Response**: Recent activities list

### GET /dashboard/upcoming-deadlines
- **Description**: Get upcoming deadlines
- **Headers**: Authorization Bearer token
- **Response**: Upcoming deadlines list

### GET /dashboard/{role}
- **Description**: Get role-specific dashboard
- **Headers**: Authorization Bearer token
- **Path Parameters**:
  - `role`: string (e.g., 'admin', 'user')
- **Response**: Role-specific dashboard data

### GET /dashboard/summary
- **Description**: Get general dashboard summary
- **Headers**: Authorization Bearer token
- **Response**: Dashboard summary object with:
  - total_activities: number
  - by_status: object
  - by_type: object
  - recent_activities: array

## 11. Search Endpoints

### GET /search
- **Description**: Global search across entities
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `q`: string (search query)
  - `type`: string (entity type, optional)
  - `page`: number
  - `perPage`: number
  - `filters`: object (optional)
- **Response**: Search results with entity types

### GET /search/activities
- **Description**: Search activities
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `q`: string
  - `filters`: object (optional)
  - `page`: number
  - `perPage`: number
- **Response**: Paginated search results

### GET /search/organisations
- **Description**: Search organisations
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `q`: string
  - `filters`: object (optional)
  - `page`: number
  - `perPage`: number
- **Response**: Paginated search results

### GET /search/users
- **Description**: Search users
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `q`: string
  - `filters`: object (optional)
  - `page`: number
  - `perPage`: number
- **Response**: Paginated search results

## 12. System Endpoints

### GET /system/health
- **Description**: System health check
- **Response**: Health status object

### GET /system/info
- **Description**: System information
- **Response**: System info object (version, environment, etc.)

### GET /system/config
- **Description**: System configuration
- **Headers**: Authorization Bearer token (if protected)
- **Response**: System configuration object

### GET /system/maintenance
- **Description**: Check maintenance status
- **Response**: Maintenance status object

## 13. User Profile Management

### GET /users/me
- **Description**: Get current user profile (duplicate endpoint)
- **Headers**: Authorization Bearer token
- **Response**: User profile object

### PUT /users/me
- **Description**: Update current user profile
- **Headers**:
  - Authorization Bearer token
  - Content-Type: multipart/form-data
- **Request Body**: FormData with:
  - `name`: string (optional)
  - `profile_picture`: File (optional)
- **Response**: Updated user profile

### PUT /users/me/password
- **Description**: Change user password (alternative endpoint)
- **Headers**: Authorization Bearer token
- **Request Body**:
  ```json
  {
    "current_password": string,
    "password": string,
    "password_confirmation": string
  }
  ```
- **Response**: Success message

## Error Response Format

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message",
      "code": "VALIDATION_ERROR"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

Implement rate limiting with appropriate headers:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## WebSocket Events

For real-time features, implement WebSocket events:

### Connection
- URL: `ws://localhost:8000/ws`
- Authorization: Send token as query parameter or in initial message

### Events
- `notification` - New notification
- `activity_update` - Activity status change
- `message` - New message

Event format:
```json
{
  "type": "event_type",
  "payload": event_data,
  "timestamp": "2024-01-01T00:00:00Z",
  "userId": "user_id"
}
```

## 14. Analytics Endpoints

### GET /analytics/activities/status
- **Description**: Get activity status breakdown for analytics
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `organisation_id`: number (optional)
  - `dateFrom`: string (YYYY-MM-DD, optional)
  - `dateTo`: string (YYYY-MM-DD, optional)
- **Response**: Status breakdown object
  ```json
  {
    "success": true,
    "data": {
      "draft": number,
      "submitted": number,
      "approved": number,
      "rejected": number,
      "completed": number
    }
  }
  ```

### GET /analytics/activities/heatmap
- **Description**: Get activity heatmap data for visualization
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `organisation_id`: number (optional)
  - `year`: number (optional, default: current year)
  - `month`: number (optional, default: current month)
- **Response**: Heatmap data object
  ```json
  {
    "success": true,
    "data": [
      {
        "date": "2025-01-15",
        "count": 5,
        "status": "completed"
      }
    ]
  }
  ```

### GET /analytics/engagement
- **Description**: Get user engagement metrics
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `organisation_id`: number (optional)
  - `period`: "daily" | "weekly" | "monthly" (default: "weekly")
- **Response**: Engagement metrics object
  ```json
  {
    "success": true,
    "data": {
      "active_users": number,
      "total_activities": number,
      "messages_sent": number,
      "reports_generated": number
    }
  }
  ```

### GET /analytics/engagement/trends
- **Description**: Get engagement trends over time
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `period`: "7d" | "30d" | "90d" (default: "30d")
  - `organisation_id`: number (optional)
- **Response**: Trend data object
  ```json
  {
    "success": true,
    "data": [
      {
        "date": "2025-01-01",
        "active_users": 45,
        "activities_created": 12
      }
    ]
  }
  ```

### GET /analytics/organisation-comparison
- **Description**: Compare metrics across organizations
- **Headers**: Authorization Bearer token
- **Query Parameters**:
  - `organisation_ids`: number[] (comma-separated)
  - `metrics`: string[] (comma-separated, optional)
- **Response**: Comparison data object
  ```json
  {
    "success": true,
    "data": [
      {
        "organisation_id": 1,
        "organisation_name": "Health Org A",
        "total_activities": 45,
        "completion_rate": 0.87
      }
    ]
  }
  ```

## 15. Help Center Endpoints

### GET /help/articles
- **Description**: Get help center articles
- **Query Parameters**:
  - `category`: string (optional)
  - `search`: string (optional)
  - `page`: number (default: 1)
  - `perPage`: number (default: 20)
- **Headers**: Authorization Bearer token (optional)
- **Response**: Paginated articles list

### GET /help/articles/{id}
- **Description**: Get specific help article
- **Headers**: Authorization Bearer token (optional)
- **Response**: Article object with content

### GET /help/search
- **Description**: Search help center
- **Query Parameters**:
  - `q`: string (search query)
  - `category`: string (optional)
- **Headers**: Authorization Bearer token (optional)
- **Response**: Search results with articles

### GET /help/categories
- **Description**: Get help center categories
- **Headers**: Authorization Bearer token (optional)
- **Response**: Categories list
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Getting Started",
        "slug": "getting-started",
        "description": "Basic guides for new users",
        "article_count": 15
      }
    ]
  }
  ```

## System Endpoint Updates

### GET /system/health
- **Description**: System health check (public endpoint)
- **Response**: Health status object
  ```json
  {
    "status": "ok",
    "timestamp": "2025-01-15T10:30:00Z"
  }
  ```

### GET /
- **Description**: API root endpoint (public)
- **Response**: API information object
  ```json
  {
    "message": "CCIP API",
    "version": "1.0",
    "status": "operational",
    "endpoints": {
      "api": "/api/v1",
      "documentation": "See API documentation for available endpoints"
    }
  }
  ```