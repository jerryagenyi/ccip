# Contact Form Setup Guide

## Overview

The contact form on the landing page (`/`) allows unauthenticated users to send inquiries, demo requests, or questions to the CCIP team. The form submits to a backend API endpoint that sends email notifications.

## Implementation Details

### Backend

**Controller:** `backend/app/Http/Controllers/ContactController.php`
- Handles POST requests to `/api/v1/contact`
- Validates form data (name, email, subject, message)
- Sends email notifications to admin
- Sends auto-reply to user
- Gracefully handles email configuration issues

**Route:** `backend/routes/api.php`
- Public route (no authentication required)
- `POST /api/v1/contact`

**Email Templates:**
- `backend/resources/views/emails/contact.blade.php` - Admin notification
- `backend/resources/views/emails/contact-auto-reply.blade.php` - User auto-reply

### Frontend

**Component:** `frontend/src/pages/IndexPage.vue`
- Contact form section with validation
- Integrates with API service
- Shows success/error notifications
- Resets form on successful submission

## Configuration

### Email Setup

To enable email notifications, configure Laravel mail settings in your `.env` file:

```env
# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@ccip.local
MAIL_FROM_NAME="${APP_NAME}"

# Admin email for contact form notifications
MAIL_ADMIN_EMAIL=admin@ccip.local
```

**Note:** If email is not configured, contact form submissions will still succeed but will only be logged instead of sending emails.

### Testing Email Configuration

You can test email configuration using Laravel Tinker:

```bash
cd backend
php artisan tinker

# Test email
Mail::raw('Test email', function ($message) {
    $message->to('jerryagenyi@gmail.com')
        ->subject('Test Email');
});
```

## API Endpoint

### POST `/api/v1/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Demo Request",
  "message": "I would like to schedule a demo of CCIP."
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Thank you for your message! We'll get back to you soon.",
  "data": null
}
```

**Response (Validation Error - 422):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": ["The email must be a valid email address."],
    "name": ["The name field is required."]
  }
}
```

## Features

1. **Form Validation:**
   - Name: Required, max 255 characters
   - Email: Required, valid email format, max 255 characters
   - Subject: Required, max 255 characters
   - Message: Required, max 5000 characters

2. **Email Notifications:**
   - Admin receives notification with all form data
   - User receives auto-reply confirmation
   - Both emails are HTML-formatted with branding

3. **Error Handling:**
   - Graceful degradation if email is not configured
   - Errors are logged but don't fail the request
   - User always receives success message

4. **Security:**
   - Public endpoint (no auth required)
   - Input validation and sanitization
   - Rate limiting (handled by Laravel middleware)

## Future Enhancements

Consider adding:

1. **Database Storage:**
   - Create `ContactSubmission` model and migration
   - Store submissions for analytics and follow-up
   - Add admin panel to view submissions

2. **Spam Protection:**
   - Add reCAPTCHA or similar
   - Rate limiting per IP
   - Honeypot fields

3. **Integration:**
   - Connect to CRM (Salesforce, HubSpot)
   - Slack/Teams notifications
   - Ticket system integration

4. **Analytics:**
   - Track submission sources
   - Common questions analysis
   - Response time metrics

## Troubleshooting

### Emails Not Sending

1. **Check Mail Configuration:**
   ```bash
   php artisan config:clear
   php artisan config:cache
   ```

2. **Check Logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Test Mail Connection:**
   ```bash
   php artisan tinker
   Mail::raw('Test', fn($m) => $m->to('test@example.com')->subject('Test'));
   ```

### Form Not Submitting

1. **Check API URL:**
   - Verify `VITE_API_URL` in frontend `.env`
   - Check browser console for errors
   - Verify CORS settings

2. **Check Network Tab:**
   - Look for 422 validation errors
   - Check request payload
   - Verify response format

## Related Files

- Backend Controller: `backend/app/Http/Controllers/ContactController.php`
- API Route: `backend/routes/api.php` (line ~32)
- Email Templates: `backend/resources/views/emails/contact*.blade.php`
- Frontend Component: `frontend/src/pages/IndexPage.vue`
- API Service: `frontend/src/services/api.ts`

