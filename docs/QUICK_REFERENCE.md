# 🎯 SheetTree - Quick Reference Card

## Essential Commands & Information

---

## 🚀 Quick Start (Development)

### Start Backend

```bash
cd backend
composer start
# API available at: http://localhost:8000/api.php
```

### Start Frontend

```bash
cd frontend
npm run dev
# App available at: http://localhost:5173
```

---

## 🧪 Testing

### Run All Tests

```bash
run-all-tests.bat
```

### Backend Tests Only

```bash
cd backend
vendor\bin\phpunit --testdox
```

### Frontend Tests Only

```bash
cd frontend
npm test                 # Run tests
npm run test:ui          # Interactive UI
npm run test:coverage    # Coverage report
```

---

## 📁 Project Structure

```
sheetTree/
├── backend/               # PHP API
│   ├── src/
│   │   ├── Controllers/   # API endpoints
│   │   ├── Models/        # Database models
│   │   ├── Routes/        # Route definitions
│   │   ├── Services/      # Business logic
│   │   ├── Middleware/    # Request processing
│   │   ├── Validators/    # Input validation
│   │   └── Utils/         # Utilities
│   ├── tests/             # PHPUnit tests
│   ├── database/          # Migrations & seeds
│   └── public/            # Web root
│
├── frontend/              # React App
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   └── tests/         # Vitest tests
│   └── dist/              # Build output
│
└── Documentation/
    ├── API_DOCUMENTATION.md
    ├── PRODUCTION_DEPLOYMENT_CHECKLIST.md
    ├── PRODUCTION_READY_SUMMARY.md
    └── FORM_TEMPLATES_GUIDE.md
```

---

## 🔑 Important Files

### Configuration

- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables
- `backend/phpunit.xml` - PHPUnit configuration
- `frontend/vitest.config.js` - Vitest configuration

### Entry Points

- `backend/public/index.php` - API entry point
- `frontend/src/main.jsx` - React entry point
- `frontend/index.html` - HTML template

---

## 🛠️ Key Features & Files

### Form Templates (NEW!)

- **Model**: `backend/src/Models/FormTemplate.php`
- **Controller**: `backend/src/Controllers/FormTemplateController.php`
- **Routes**: `backend/src/Routes/FormTemplateRoutes.php`
- **Component**: `frontend/src/components/Forms/TemplateSelector.jsx`
- **Seed Data**: `backend/database/seeds/form_templates_seed.sql`
- **10 templates** across **8 categories**

### Email Notifications

- **Service**: `backend/src/Services/EmailService.php`
- **Controller**: `backend/src/Controllers/NotificationController.php`
- **Routes**: `backend/src/Routes/NotificationRoutes.php`
- Supports: Email, Webhook, Both

### Security & Validation

- **Validator**: `backend/src/Validators/InputValidator.php`
- **Rate Limit**: `backend/src/Middleware/RateLimitMiddleware.php`
- **Security Headers**: `backend/src/Middleware/SecurityHeadersMiddleware.php`
- **Utils**: `backend/src/Utils/SecurityUtil.php`

---

## 📊 Test Coverage

### Backend (PHPUnit)

- ✅ User Model (3 tests)
- ✅ Form Model (5 tests)
- ✅ FormTemplate Model (6 tests)
- ✅ Auth API (4 tests)
- ✅ Form API (6 tests)
- **Total: 24 tests**

### Frontend (Vitest)

- ✅ Toast Component (4 tests)
- ✅ TemplateSelector Component (6 tests)
- **Total: 10 tests**

### Grand Total: **34 Tests** ✅

---

## 🔒 Security Features

| Feature                  | Status | File                          |
| ------------------------ | ------ | ----------------------------- |
| Rate Limiting            | ✅     | RateLimitMiddleware.php       |
| Input Validation         | ✅     | InputValidator.php            |
| Security Headers         | ✅     | SecurityHeadersMiddleware.php |
| XSS Prevention           | ✅     | SecurityUtil.php              |
| SQL Injection Protection | ✅     | SecurityUtil.php              |
| CSRF Tokens              | ✅     | SecurityUtil.php              |
| Password Hashing         | ✅     | Argon2ID                      |
| JWT Auth                 | ✅     | AuthMiddleware.php            |

---

## 📡 API Endpoints (Quick Reference)

### Authentication

```
GET  /auth/google      - OAuth login
GET  /auth/callback    - OAuth callback
GET  /auth/me          - Get current user
```

### Forms

```
GET    /forms          - List user forms
POST   /forms          - Create form
GET    /forms/{id}     - Get single form
PUT    /forms/{id}     - Update form
DELETE /forms/{id}     - Delete form
```

### Form Templates

```
GET  /templates              - List all templates
GET  /templates/{id}         - Get single template
POST /templates/{id}/use     - Use template (track usage)
GET  /templates/categories   - Get categories
```

### Submissions

```
POST /forms/{id}/submit         - Submit form (public)
GET  /forms/{id}/submissions    - Get submissions (auth)
```

### Notifications

```
GET    /notifications/{formId}    - Get form notifications
POST   /notifications             - Create notification
PUT    /notifications/{id}        - Update notification
DELETE /notifications/{id}        - Delete notification
POST   /notifications/{id}/test   - Test notification
```

---

## 🌐 URLs (Development)

| Service     | URL                                |
| ----------- | ---------------------------------- |
| Frontend    | http://localhost:5173              |
| Backend API | http://localhost:8000/api.php      |
| Test Form   | http://localhost:5173/forms/create |
| Templates   | http://localhost:5173/templates    |

---

## 🔧 Common Tasks

### Update Dependencies

```bash
# Backend
cd backend
composer update

# Frontend
cd frontend
npm update
```

### Database Operations

```bash
# Create database
mysql -u root -e "CREATE DATABASE sheettree_db;"

# Run migrations
mysql -u root sheettree_db < backend/database/migrations/*.sql

# Seed templates
mysql -u root sheettree_db < backend/database/seeds/form_templates_seed.sql

# Backup database
mysqldump -u root sheettree_db > backup.sql
```

### Build for Production

```bash
# Backend
cd backend
composer install --no-dev --optimize-autoloader

# Frontend
cd frontend
npm ci --production
npm run build
# Output in: frontend/dist/
```

---

## 📚 Documentation Files

| File                                 | Purpose                |
| ------------------------------------ | ---------------------- |
| `API_DOCUMENTATION.md`               | Complete API reference |
| `PRODUCTION_DEPLOYMENT_CHECKLIST.md` | Deployment guide       |
| `PRODUCTION_READY_SUMMARY.md`        | Overview & status      |
| `FORM_TEMPLATES_GUIDE.md`            | Template feature guide |
| `README.md`                          | Project overview       |

---

## ⚙️ Environment Variables (Essential)

### Backend (.env)

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback

DB_HOST=localhost
DB_NAME=sheettree_db
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your_secret_key_here
JWT_EXPIRY=86400

APP_ENV=development
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api.php
```

---

## 🎯 Client Demo Checklist

- [ ] Backend API running
- [ ] Frontend app running
- [ ] Database seeded with templates
- [ ] Google OAuth configured
- [ ] Test user created
- [ ] Sample forms created
- [ ] Email notifications tested
- [ ] Webhook notifications tested
- [ ] All tests passing

---

## 🆘 Troubleshooting

### Backend not starting?

```bash
# Check PHP version
php -v  # Must be 8.0+

# Check dependencies
cd backend
composer install

# Check database
mysql -u root -e "SHOW DATABASES;"
```

### Frontend not starting?

```bash
# Check Node version
node -v  # Must be 16+

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
```

### Tests failing?

```bash
# Setup test database
mysql -u root -e "CREATE DATABASE sheettree_test;"
mysql -u root sheettree_test < backend/database/test_database_setup.sql

# Clear vendor cache
cd backend
rm -rf vendor
composer install
```

---

## 📞 Support

Check these in order:

1. Error logs (browser console, PHP logs)
2. Environment variables
3. Database connection
4. Google OAuth credentials
5. CORS settings
6. File permissions

---

## ✅ Production Status

- [x] 34 tests passing
- [x] Security hardened
- [x] Input validation complete
- [x] Rate limiting implemented
- [x] API documentation complete
- [x] Deployment guide ready
- [x] Code reviewed

**Status: PRODUCTION READY ✅**

---

**Last Updated**: December 18, 2025  
**Version**: 1.0.0  
**Your Senior Full Stack Developer**
