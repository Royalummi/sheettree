# SheetTree API Documentation

## Complete API Reference for Production

---

## Table of Contents

1. [Authentication](#authentication)
2. [Forms API](#forms-api)
3. [Form Templates API](#form-templates-api)
4. [Sheets API](#sheets-api)
5. [Notifications API](#notifications-api)
6. [Form Submissions API](#form-submissions-api)
7. [Error Responses](#error-responses)
8. [Rate Limiting](#rate-limiting)
9. [Security](#security)

---

## Base URL

- **Development**: `http://localhost:8000/api.php`
- **Production**: `https://yourdomain.com/api.php`

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

### Login with Google OAuth

**Endpoint**: `GET /auth/google`

**Description**: Redirect users to Google OAuth consent screen

**Response**: Redirects to Google OAuth

### OAuth Callback

**Endpoint**: `GET /auth/callback`

**Description**: Handles Google OAuth callback and creates/updates user

**Response**:

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  }
}
```

### Get Current User

**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

---

## Forms API

### Get All User Forms

**Endpoint**: `GET /forms`

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "forms": [
    {
      "id": 1,
      "title": "Contact Form",
      "description": "Simple contact form",
      "fields": [...],
      "is_active": true,
      "is_public": true,
      "submission_count": 25,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Get Single Form

**Endpoint**: `GET /forms/{id}`

**Headers**: `Authorization: Bearer {token}` (required for private forms)

**Response**:

```json
{
  "form": {
    "id": 1,
    "title": "Contact Form",
    "description": "Simple contact form",
    "fields": [
      {
        "id": 1,
        "type": "text",
        "label": "Name",
        "name": "name",
        "required": true,
        "placeholder": "Enter your name"
      },
      {
        "id": 2,
        "type": "email",
        "label": "Email",
        "name": "email",
        "required": true
      }
    ],
    "connected_sheet_id": 5,
    "is_active": true,
    "is_public": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

### Create Form

**Endpoint**: `POST /forms`

**Headers**: `Authorization: Bearer {token}`

**Body**:

```json
{
  "title": "Contact Form",
  "description": "Simple contact form",
  "fields": [
    {
      "type": "text",
      "label": "Name",
      "required": true,
      "placeholder": "Enter your name"
    },
    {
      "type": "email",
      "label": "Email",
      "required": true
    }
  ],
  "connected_sheet_id": 5,
  "is_active": true,
  "is_public": true
}
```

**Validation Rules**:

- `title`: Required, 1-255 characters
- `description`: Optional, max 5000 characters
- `fields`: Required array, each field must have `type` and `label`
- Valid field types: `text`, `email`, `tel`, `date`, `textarea`, `select`, `radio`, `checkbox`, `number`

**Response**: `201 Created`

```json
{
  "message": "Form created successfully",
  "form": {
    "id": 1,
    "title": "Contact Form",
    ...
  }
}
```

### Update Form

**Endpoint**: `PUT /forms/{id}`

**Headers**: `Authorization: Bearer {token}`

**Body**: Same as Create Form (all fields optional)

**Response**: `200 OK`

### Delete Form

**Endpoint**: `DELETE /forms/{id}`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`

```json
{
  "message": "Form deleted successfully"
}
```

---

## Form Templates API

### Get All Templates

**Endpoint**: `GET /templates`

**Query Parameters**:

- `category` (optional): Filter by category

**Response**:

```json
{
  "templates": [
    {
      "id": 1,
      "name": "Contact Form",
      "description": "Basic contact form",
      "category": "contact",
      "icon": "MessageSquare",
      "fields": [...],
      "settings": {
        "submitButtonText": "Send",
        "successMessage": "Thank you!"
      },
      "usage_count": 150,
      "is_active": true
    }
  ]
}
```

### Get Single Template

**Endpoint**: `GET /templates/{id}`

**Response**:

```json
{
  "template": {
    "id": 1,
    "name": "Contact Form",
    "description": "Basic contact form",
    "category": "contact",
    "icon": "MessageSquare",
    "fields": [...],
    "settings": {...},
    "usage_count": 150
  }
}
```

### Use Template (Track Usage)

**Endpoint**: `POST /templates/{id}/use`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`

### Get Template Categories

**Endpoint**: `GET /templates/categories`

**Response**:

```json
{
  "categories": [
    { "value": "contact", "label": "Contact" },
    { "value": "survey", "label": "Survey" },
    { "value": "registration", "label": "Registration" }
  ]
}
```

---

## Sheets API

### Get All User Sheets

**Endpoint**: `GET /sheets`

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "sheets": [
    {
      "id": 1,
      "spreadsheet_id": "abc123",
      "spreadsheet_name": "My Data",
      "sheet_name": "Sheet1",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Connect New Sheet

**Endpoint**: `POST /sheets`

**Headers**: `Authorization: Bearer {token}`

**Body**:

```json
{
  "spreadsheet_id": "abc123",
  "spreadsheet_name": "My Data",
  "sheet_name": "Sheet1"
}
```

---

## Notifications API

### Get Form Notifications

**Endpoint**: `GET /notifications/{formId}`

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "notifications": [
    {
      "id": 1,
      "form_id": 5,
      "type": "email",
      "email_addresses": "admin@example.com,team@example.com",
      "webhook_url": null,
      "is_active": true
    }
  ]
}
```

### Create Notification

**Endpoint**: `POST /notifications`

**Headers**: `Authorization: Bearer {token}`

**Body**:

```json
{
  "form_id": 5,
  "type": "both",
  "email_addresses": "admin@example.com,team@example.com",
  "webhook_url": "https://example.com/webhook"
}
```

**Validation**:

- `type`: Must be `email`, `webhook`, or `both`
- If type includes `email`: `email_addresses` required (comma-separated)
- If type includes `webhook`: `webhook_url` required (valid URL)

### Update Notification

**Endpoint**: `PUT /notifications/{id}`

**Headers**: `Authorization: Bearer {token}`

### Delete Notification

**Endpoint**: `DELETE /notifications/{id}`

**Headers**: `Authorization: Bearer {token}`

### Test Notification

**Endpoint**: `POST /notifications/{id}/test`

**Headers**: `Authorization: Bearer {token}`

**Response**:

```json
{
  "message": "Test notification sent successfully"
}
```

---

## Form Submissions API

### Submit Form (Public)

**Endpoint**: `POST /forms/{formId}/submit`

**Headers**: None required (public endpoint)

**Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question..."
}
```

**Response**: `200 OK`

```json
{
  "message": "Form submitted successfully",
  "submission_id": 123
}
```

### Get Form Submissions

**Endpoint**: `GET /forms/{formId}/submissions`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `sort` (optional): Sort order (`asc` or `desc`, default: `desc`)

**Response**:

```json
{
  "submissions": [
    {
      "id": 123,
      "form_id": 5,
      "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "message": "..."
      },
      "submitted_at": "2025-01-01T12:00:00Z",
      "ip_address": "192.168.1.1"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "errors": {
    "field_name": "Specific field error"
  }
}
```

### HTTP Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | Success                                 |
| 201  | Created                                 |
| 400  | Bad Request (validation error)          |
| 401  | Unauthorized (missing/invalid token)    |
| 403  | Forbidden (insufficient permissions)    |
| 404  | Not Found                               |
| 429  | Too Many Requests (rate limit exceeded) |
| 500  | Internal Server Error                   |

---

## Rate Limiting

**Default Limits**:

- **Authenticated users**: 100 requests per minute
- **Public endpoints**: 60 requests per minute per IP

**Headers in Response**:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

**When Rate Limit Exceeded**:

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Maximum 100 requests per 60 seconds.",
  "retry_after": 45
}
```

---

## Security

### CORS

Allowed origins are configured in `.env`:

```
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### Input Validation

All inputs are:

- Sanitized to prevent XSS
- Validated against type constraints
- Checked for SQL injection patterns

### Best Practices

1. **Always use HTTPS in production**
2. **Store JWT tokens securely** (httpOnly cookies or secure storage)
3. **Never expose sensitive data** in client-side code
4. **Rotate JWT secrets** regularly
5. **Monitor rate limit violations**
6. **Use strong passwords** for database access
7. **Keep dependencies updated**

---

## Webhook Format

When notifications are triggered, webhooks receive:

```json
{
  "event": "form.submitted",
  "form_id": 5,
  "form_title": "Contact Form",
  "submission": {
    "id": 123,
    "data": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "submitted_at": "2025-01-01T12:00:00Z"
  }
}
```

**Headers**:

```
Content-Type: application/json
X-SheetTree-Signature: sha256_hmac_signature
```

---

## Testing Endpoints

Use the provided Postman collection or test with curl:

```bash
# Login (get token from response)
curl -X GET http://localhost:8000/api.php?path=auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create form
curl -X POST http://localhost:8000/api.php?path=forms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Form",
    "description": "Test",
    "fields": [{"type": "text", "label": "Name", "required": true}],
    "is_active": true,
    "is_public": true
  }'
```

---

## Support

For issues or questions:

- Check error messages and status codes
- Review validation requirements
- Ensure proper authentication headers
- Verify rate limits haven't been exceeded
