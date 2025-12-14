# API Endpoints Reference

## Quick Reference

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset
- `POST /auth/reset-password` - Confirm password reset

### Organizations
- `GET /organizations` - List organizations
- `POST /organizations` - Create organization
- `GET /organizations/{id}` - Get organization details
- `PUT /organizations/{id}` - Update organization
- `GET /organizations/{id}/users` - List organization users

### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `GET /users/{id}` - Get user details
- `GET /users/search` - Search users
- `POST /users/{id}/invite` - Invite user to organization

### Activities
- `GET /activities` - List activities
- `POST /activities` - Create activity
- `GET /activities/{id}` - Get activity details
- `PUT /activities/{id}` - Update activity
- `DELETE /activities/{id}` - Delete activity
- `GET /activities/{id}/reports` - Get activity reports

### Reports
- `GET /reports` - List reports
- `POST /reports` - Submit report
- `GET /reports/{id}` - Get report details
- `PUT /reports/{id}` - Update report
- `POST /reports/{id}/attachments` - Upload attachments

### Semiotic Assessment
- `POST /semiotic/analyze` - Analyze message for risks
- `GET /semiotic/patterns` - List semiotic patterns
- `GET /semiotic/patterns/{id}` - Get pattern details

### Notifications
- `GET /notifications` - List notifications
- `PUT /notifications/{id}/read` - Mark notification as read
- `POST /notifications/send` - Send notification

## Detailed Specification

For complete API documentation including request/response examples, see: [API Reference Document](reference.md)