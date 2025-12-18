# SheetTree Backend API

A powerful Google Sheets integration API built with Slim Framework 4, providing OAuth authentication, sheet management, and form submission capabilities.

## 🚀 Features

- **Google OAuth 2.0 Integration** - Secure user authentication with Google
- **Google Sheets API** - Full read/write access to user's sheets
- **JWT Authentication** - Stateless authentication for API security
- **Multi-user Support** - Each user manages their own sheets and forms
- **Admin Panel** - Administrative oversight of all users and data
- **Form Validation** - Configurable validation rules for form submissions
- **External API Integration** - SheetMonkey-like public APIs for third-party integrations
- **Embeddable Forms** - Iframe-based forms with customizable themes and styling
- **Rate Limiting & Security** - Comprehensive protection against abuse
- **Real-time Analytics** - Track API usage, performance, and statistics
- **RESTful API** - Clean, well-structured API endpoints

## 🛠️ Technology Stack

- **PHP 8.0+** - Modern PHP with strong typing
- **Slim Framework 4** - Lightweight, fast micro-framework
- **MySQL** - Reliable relational database
- **Google APIs Client Library** - Official Google API integration
- **Firebase JWT** - JSON Web Token implementation
- **Eloquent ORM** - Laravel's database ORM for clean queries
- **Composer** - Dependency management

## 📋 Requirements

- PHP 8.0 or higher
- MySQL 5.7 or higher
- Composer
- XAMPP (for local development)
- Google Cloud Console project with OAuth credentials

## ⚡ Quick Start

### 1. Install Dependencies

```bash
cd backend
composer install
```

### 2. Environment Setup

```bash
# Copy the example environment file
copy .env.example .env

# Edit .env with your configurations
```

### 3. Configure Environment Variables

Edit `.env` file with your settings:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback

# Database Configuration
DB_HOST=localhost
DB_NAME=sheettree_db
DB_USERNAME=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRY=86400

# App Configuration
APP_ENV=development
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE sheettree_db"

# Run migrations
php database/migrate.php
```

### 5. Start the Server

```bash
# Using PHP built-in server
composer start

# Or using XAMPP
# Place the project in htdocs and access via http://localhost/sheetTree/backend/public
```

## 🔧 API Endpoints

### Authentication

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| GET    | `/auth/google`   | Initiate Google OAuth flow |
| GET    | `/auth/callback` | Handle OAuth callback      |
| POST   | `/auth/refresh`  | Refresh JWT token          |
| POST   | `/auth/logout`   | Logout user                |

### User Management

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | `/user/profile`   | Get user profile    |
| PUT    | `/user/profile`   | Update user profile |
| GET    | `/user/dashboard` | Get dashboard data  |

### Google Sheets

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| GET    | `/sheets`                | Get user's connected sheets     |
| POST   | `/sheets/connect`        | Connect a new sheet (manual)    |
| POST   | `/sheets/connect/picker` | Connect sheet via Google Picker |
| DELETE | `/sheets/{id}`           | Disconnect a sheet              |
| GET    | `/sheets/{id}/preview`   | Preview sheet data              |

### Forms

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | `/forms`                  | Get user's forms     |
| POST   | `/forms`                  | Create a new form    |
| GET    | `/forms/{id}`             | Get specific form    |
| PUT    | `/forms/{id}`             | Update form          |
| DELETE | `/forms/{id}`             | Delete form          |
| POST   | `/forms/{id}/submit`      | Submit data to form  |
| GET    | `/forms/{id}/submissions` | Get form submissions |

### Admin (Requires Admin Role)

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/admin/users`      | Get all users        |
| GET    | `/admin/users/{id}` | Get specific user    |
| PUT    | `/admin/users/{id}` | Update user          |
| DELETE | `/admin/users/{id}` | Delete user          |
| GET    | `/admin/sheets`     | Get all sheets       |
| GET    | `/admin/forms`      | Get all forms        |
| GET    | `/admin/analytics`  | Get system analytics |

### External APIs (SheetMonkey-like Integration)

| Method | Endpoint                                    | Description                          |
| ------ | ------------------------------------------- | ------------------------------------ |
| GET    | `/api/user/api-configs`                     | Get user's API configurations        |
| POST   | `/api/user/api-configs`                     | Create new API configuration         |
| PUT    | `/api/user/api-configs/{id}`                | Update API configuration             |
| DELETE | `/api/user/api-configs/{id}`                | Delete API configuration             |
| GET    | `/api/user/api-configs/{id}/stats`          | Get API usage statistics             |
| POST   | `/api/user/api-configs/{id}/regenerate-key` | Regenerate API key                   |
| POST   | `/api/external/submit/{apiHash}`            | Submit data to external API (public) |
| GET    | `/api/external/config/{apiHash}`            | Get API configuration (public)       |
| GET    | `/api/docs/{apiHash}`                       | Generate API documentation           |
| GET    | `/api/test/{apiHash}`                       | Generate API test page               |

### Embeddable Forms

| Method | Endpoint                        | Description                     |
| ------ | ------------------------------- | ------------------------------- |
| GET    | `/embed/form/{formHash}`        | Serve embeddable form (iframe)  |
| POST   | `/embed/form/{formHash}/submit` | Handle embedded form submission |
| GET    | `/embed/form/{formHash}/theme`  | Get form theme configuration    |
| PUT    | `/forms/{id}/theme`             | Update form theme               |
| GET    | `/forms/{id}/analytics`         | Get form analytics and metrics  |
| POST   | `/forms/{id}/analytics/track`   | Track form view or interaction  |

## 📊 Database Schema

### Users Table

```sql
- id (Primary Key)
- google_id (Unique)
- email (Unique)
- name
- avatar
- is_admin (Boolean)
- created_at
- updated_at
```

### OAuth Tokens Table

```sql
- id (Primary Key)
- user_id (Foreign Key)
- refresh_token (Text)
- access_token (Text, Nullable)
- token_expires_at (Timestamp)
- scopes (Text)
- created_at
- updated_at
```

### Connected Sheets Table

```sql
- id (Primary Key)
- user_id (Foreign Key)
- spreadsheet_id
- spreadsheet_name
- sheet_name
- connection_type (manual/picker)
- created_at
- updated_at
```

### Forms Table

```sql
- id (Primary Key)
- user_id (Foreign Key)
- connected_sheet_id (Foreign Key)
- name
- description
- form_config (JSON)
- validation_rules (JSON)
- is_active (Boolean)
- created_at
- updated_at
```

### Form Submissions Table

```sql
- id (Primary Key)
- form_id (Foreign Key)
- submission_data (JSON)
- ip_address
- user_agent
- created_at
- updated_at
```

### External API Configurations Table

```sql
- id (Primary Key)
- user_id (Foreign Key)
- connected_sheet_id (Foreign Key)
- api_name
- api_description
- api_hash (Unique)
- api_key (Unique)
- sheet_range
- validation_rules (JSON)
- rate_limit_per_minute
- rate_limit_per_hour
- rate_limit_per_day
- allowed_origins (JSON)
- require_auth (Boolean)
- webhook_url (Nullable)
- is_active (Boolean)
- last_used_at (Timestamp)
- created_at
- updated_at
```

### External API Submissions Table

```sql
- id (Primary Key)
- api_config_id (Foreign Key)
- submission_data (JSON)
- ip_address
- user_agent
- response_status
- response_time_ms
- validation_errors (JSON, Nullable)
- created_at
- updated_at
```

### External API Usage Stats Table

```sql
- id (Primary Key)
- api_config_id (Foreign Key)
- date
- total_requests
- successful_requests
- failed_requests
- avg_response_time_ms
- unique_ips
- created_at
- updated_at
```

## 🔒 Authentication Flow

### 1. Google OAuth Process

```php
// 1. User clicks "Login with Google"
GET /auth/google

// 2. Redirect to Google OAuth
// Google handles user consent

// 3. Google redirects back with code
GET /auth/callback?code=...&state=...

// 4. Exchange code for tokens
$token = $client->fetchAccessTokenWithAuthCode($code);

// 5. Get user info from Google
$oauth2 = new Google_Service_Oauth2($client);
$userinfo = $oauth2->userinfo->get();

// 6. Create/update user in database
User::updateOrCreate(['google_id' => $userinfo->id], $userData);

// 7. Generate JWT token
$jwtToken = JWT::encode($payload, $secret, 'HS256');

// 8. Redirect to frontend with token
```

### 2. JWT Token Usage

```php
// Include in all API requests
Authorization: Bearer <jwt_token>

// Middleware validates token
$decoded = JWT::decode($token, new Key($secret, 'HS256'));
$user = User::find($decoded->user_id);
```

## 🔗 External API Integration (SheetMonkey-like)

SheetTree provides a powerful External API system that allows users to create public APIs for their Google Sheets, similar to SheetMonkey. This feature enables third-party applications to submit data directly to Google Sheets through custom API endpoints.

## 🎨 Embeddable Forms Integration

SheetTree also provides beautiful embeddable iframe forms that can be customized to match any website's design. Users can choose between programmatic API access or visual form embedding based on their needs.

### Dual Integration Approach

**Option 1: External API (Developer-focused)**

```javascript
// Programmatic data submission
fetch("/api/external/submit/abc123", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello from my app!",
  }),
});
```

**Option 2: Embeddable Form (User-friendly)**

```html
<!-- Visual form embedding -->
<iframe
  src="/embed/form/abc123"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;"
>
</iframe>
```

**Option 3: Hybrid Approach**

- Use embeddable forms for most users
- Use API for advanced integrations
- Both submit to the same Google Sheet
- Unified analytics and management

### Key Features

- **Custom API Endpoints** - Each API gets a unique hash-based endpoint
- **Rate Limiting** - Configurable per-minute, per-hour, and per-day limits
- **Field Validation** - Custom validation rules for submitted data
- **CORS Support** - Configurable allowed origins for web applications
- **Authentication Options** - Optional API key authentication
- **Real-time Statistics** - Track usage, success rates, and performance
- **Webhook Support** - Optional webhook notifications for new submissions
- **Auto-generated Documentation** - API docs and test pages for each endpoint

### Creating an External API

1. **Connect a Google Sheet** - User must have a connected sheet
2. **Configure API Settings** - Name, description, and target sheet range
3. **Set Validation Rules** - Define required fields and validation patterns
4. **Configure Rate Limits** - Set appropriate usage limits
5. **Set Security Options** - CORS origins, authentication requirements
6. **Generate API** - System creates unique API hash and endpoint

### API Usage Flow

```php
// 1. External application submits data
POST /api/external/submit/{apiHash}
Content-Type: application/json
{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello from external app!"
}

// 2. System validates the submission
- Check rate limits
- Validate required fields
- Check CORS origin (if enabled)
- Verify API key (if required)

// 3. Write to Google Sheets
- Connect to user's Google account
- Append data to specified sheet range
- Format data according to configuration

// 4. Return response
{
    "success": true,
    "message": "Data submitted successfully",
    "submission_id": "abc123"
}

// 5. Update statistics
- Increment usage counters
- Track response times
- Log submission details
```

### Security Features

- **Rate Limiting** - Prevent abuse with configurable limits
- **CORS Protection** - Control which domains can access the API
- **API Key Authentication** - Optional authentication for sensitive APIs
- **Input Validation** - Sanitize and validate all submitted data
- **IP Tracking** - Log IP addresses for security monitoring
- **Webhook Verification** - Secure webhook payload signing

### Frontend Management Interface

The React frontend provides a complete management interface for External APIs:

- **API Dashboard** - Overview of all APIs with statistics
- **Create API Wizard** - Step-by-step API creation process
- **API Editor** - Modify existing API configurations
- **Statistics Dashboard** - Visual charts and usage analytics
- **API Testing** - Built-in testing tools for API endpoints
- **Key Management** - Regenerate API keys and view documentation

### Example API Configuration

```json
{
  "api_name": "Contact Form API",
  "api_description": "Collects contact form submissions",
  "sheet_range": "A:C",
  "validation_rules": {
    "name": {
      "required": true,
      "type": "string",
      "min_length": 2,
      "max_length": 50
    },
    "email": {
      "required": true,
      "type": "email"
    },
    "message": {
      "required": true,
      "type": "string",
      "min_length": 10,
      "max_length": 1000
    }
  },
  "rate_limit_per_minute": 10,
  "rate_limit_per_hour": 100,
  "rate_limit_per_day": 1000,
  "allowed_origins": ["https://mywebsite.com"],
  "require_auth": false,
  "webhook_url": "https://mywebsite.com/webhook"
}
```

### API Documentation Generation

Each API automatically generates:

- **OpenAPI Specification** - Standard API documentation
- **Interactive Test Page** - Web interface for testing
- **Code Examples** - Sample code in multiple languages
- **Field Reference** - Complete field documentation
- **Rate Limit Information** - Usage limits and guidelines

## 🔧 Slim Framework Overview

### Framework Structure

Slim is a PHP micro-framework that provides:

- **Routing** - Clean URL routing with parameters
- **Middleware** - Request/response processing pipeline
- **Dependency Injection** - Container-based dependency management
- **PSR-7** - HTTP message interfaces
- **Error Handling** - Structured error responses

### Key Concepts

#### 1. Application Factory

```php
// Create Slim app with container
$container = new Container();
AppFactory::setContainer($container);
$app = AppFactory::create();
```

#### 2. Route Groups

```php
// Group related routes
$app->group('/api/v1', function($group) {
    $group->get('/users', [UserController::class, 'index']);
    $group->post('/users', [UserController::class, 'create']);
});
```

#### 3. Middleware

```php
// Apply middleware to routes
$app->group('/protected', function($group) {
    // Protected routes here
})->add(new AuthMiddleware());
```

#### 4. Controllers

```php
class UserController {
    public function index(Request $request, Response $response): Response {
        $users = User::all();
        $response->getBody()->write(json_encode($users));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
```

#### 5. Dependency Injection

```php
// Register services in container
$container->set('google_client', function() {
    $client = new Google_Client();
    $client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
    return $client;
});

// Use in controllers
public function __construct(Google_Client $googleClient) {
    $this->googleClient = $googleClient;
}
```

### Best Practices

1. **Route Organization** - Group related routes logically
2. **Middleware Usage** - Apply authentication, CORS, etc.
3. **Error Handling** - Consistent error responses
4. **Validation** - Validate input data
5. **Logging** - Log important events and errors

## 🛡️ Security Considerations

### JWT Security

- Use strong secret keys
- Set appropriate expiration times
- Consider token refresh strategies
- Validate tokens on every request

### Google OAuth Security

- Validate state parameter (CSRF protection)
- Use HTTPS in production
- Store refresh tokens securely
- Handle token expiration gracefully

### API Security

- Input validation and sanitization
- Rate limiting
- CORS configuration
- SQL injection prevention (using ORM)

## 🧪 Testing

```bash
# Run tests
composer test

# Run with coverage
vendor/bin/phpunit --coverage-html coverage
```

## 📦 Deployment

### Production Checklist

1. **Environment**

   - Set `APP_ENV=production`
   - Use strong JWT secrets
   - Configure proper database credentials

2. **Security**

   - Enable HTTPS
   - Set secure headers
   - Configure proper CORS origins

3. **Performance**

   - Enable OPcache
   - Use production-ready database
   - Configure proper logging

4. **Monitoring**
   - Set up error logging
   - Monitor API performance
   - Track user activity

## 🐛 Troubleshooting

### Common Issues

1. **Composer Install Fails**

   ```bash
   # Update Composer
   composer self-update

   # Clear cache
   composer clear-cache

   # Install with verbose output
   composer install -v
   ```

2. **Database Connection Errors**

   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

3. **Google OAuth Errors**

   - Verify redirect URI matches exactly
   - Check client ID and secret
   - Ensure APIs are enabled in Google Console

4. **JWT Token Issues**
   - Check JWT secret is set
   - Verify token format
   - Check token expiration

## 📚 Additional Resources

- [Slim Framework Documentation](https://www.slimframework.com/docs/)
- [Google APIs PHP Client](https://github.com/googleapis/google-api-php-client)
- [JWT.io](https://jwt.io/) - JWT debugger
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Eloquent ORM Documentation](https://laravel.com/docs/eloquent)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
