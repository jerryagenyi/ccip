# CCIP API Documentation

## Overview

The CCIP API is a RESTful API built with Laravel 11 that provides endpoints for crisis communication management, user authentication, activity tracking, and semiotic analysis. All endpoints require authentication except for public endpoints like registration and password reset.

## Base Configuration

- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json` (except for file uploads: `multipart/form-data`)
- **Authentication**: Bearer token (JWT via Laravel Sanctum)
- **Version**: v1 (all endpoints prefixed with `/api/v1`)

## Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": object|array,
  "message": string,
  "meta": {
    "total": number,
    "page": number,
    "perPage": number,
    "totalPages": number
  }
}
```

## Error Responses

Error responses include detailed error information:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Error message 1", "Error message 2"]
  }
}
```

## Authentication

Most endpoints require authentication via Bearer token:

```
Authorization: Bearer <jwt_token>
```

### Authentication Flow

1. **Login**: `POST /auth/login` - Get JWT token
2. **API Calls**: Include token in Authorization header
3. **Refresh**: `POST /auth/refresh` - Get new token
4. **Logout**: `POST /auth/logout` - Invalidate token

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Default**: 60 requests per minute per IP
- **Authenticated**: 1000 requests per minute per user
- **File Uploads**: 10 requests per minute

## Pagination

List endpoints support pagination:

- `page`: Page number (default: 1)
- `perPage`: Items per page (default: 20, max: 100)

Example: `GET /activities?page=2&perPage=50`

## Filtering & Sorting

### Filtering
Most list endpoints support filtering via query parameters:
- `filter[field]`: Filter by field value
- `search`: Full-text search

Example: `GET /activities?filter[status]=approved&search=vaccination`

### Sorting
Sort results via query parameters:
- `sort`: Field to sort by
- `order`: `asc` or `desc` (default: `asc`)

Example: `GET /activities?sort=created_at&order=desc`

## Field Selection

Reduce response size by selecting specific fields:
- `fields`: Comma-separated field names

Example: `GET /activities?fields=id,title,status,created_at`

## API Endpoints

### Authentication
- [Authentication endpoints](authentication.md)

### Organizations
- [Organization management](endpoints/organizations.md)

### Users & Roles
- [User management](endpoints/users.md)

### Activities
- [Activity management](endpoints/activities.md)

### Reports & Analytics
- [Reporting endpoints](endpoints/reports.md)

### Patterns & Semiotic Analysis
- [Pattern database](endpoints/patterns.md)

### Communications
- [Messages & notifications](endpoints/communications.md)

## SDKs & Libraries

### JavaScript/TypeScript
```typescript
// API client configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### PHP (Guzzle)
```php
$client = new GuzzleHttp\Client([
    'base_uri' => 'http://localhost:8000/api/v1/',
    'headers' => [
        'Content-Type' => 'application/json',
        'Authorization' => 'Bearer ' . $token
    ]
]);
```

## Testing

### Postman Collection
A complete Postman collection is available in the project repository.

### Example cURL Commands
```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get activities (authenticated)
curl -X GET http://localhost:8000/api/v1/activities \
  -H "Authorization: Bearer <token>"

# Create activity
curl -X POST http://localhost:8000/api/v1/activities \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Activity","type":"campaign"}'
```

## Webhooks

CCIP supports webhooks for real-time notifications:

### Configure Webhooks
Send webhook configuration to your organization admin.

### Webhook Events
- `activity.created`: New activity created
- `activity.updated`: Activity status changed
- `report.submitted`: Field report submitted
- `user.invited`: New user invited

### Webhook Payload
```json
{
  "event": "activity.created",
  "data": {
    "id": "activity_id",
    "type": "campaign",
    "status": "draft"
  },
  "timestamp": "2025-01-01T12:00:00Z"
}
```

## Changelog

### v1.0.0 (Current)
- Initial API release
- Core CRUD operations
- Authentication & authorization
- File upload support

### Upcoming
- GraphQL endpoint (alpha testing)
- Real-time WebSocket API
- Advanced analytics endpoints

## Support

For API support:
1. Check the [troubleshooting guide](../reference/troubleshooting.md)
2. Review endpoint documentation
3. Contact the development team

---

*Last updated: December 14, 2025*