# SheetTree - Google Sheets Integration Platform

## 🎯 Production-Ready Form Builder with Google Sheets Integration

[![Tests](https://img.shields.io/badge/tests-34%20passing-brightgreen)]()
[![Security](https://img.shields.io/badge/security-hardened-blue)]()
[![Documentation](https://img.shields.io/badge/docs-complete-success)]()
[![Production](https://img.shields.io/badge/status-production%20ready-brightgreen)]()

A comprehensive, **production-ready** platform for creating custom forms with automatic Google Sheets synchronization, email notifications, webhooks, and a professional template library. Built with enterprise-grade security, comprehensive testing, and complete documentation.

---

## 🌟 Key Features

### Core Functionality

- ✅ **Google OAuth Authentication** - Secure login with Google accounts
- ✅ **Dynamic Form Builder** - Create forms with 8+ field types
- ✅ **Form Templates** - 10 pre-built templates across 8 categories
- ✅ **Google Sheets Integration** - Real-time data synchronization
- ✅ **Email Notifications** - Automated alerts with customizable recipients
- ✅ **Webhook Integration** - Real-time HTTP callbacks
- ✅ **Public Form Submissions** - Embeddable forms for any website
- ✅ **Submission Management** - View, search, and export data
- ✅ **Admin Dashboard** - Comprehensive management interface

### Production-Ready Features

- ✅ **34 Automated Tests** (Backend + Frontend)
- ✅ **Input Validation** - Comprehensive validation layer
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **Security Headers** - XSS, CSRF, clickjacking protection
- ✅ **Complete API Documentation** - Full endpoint reference
- ✅ **Deployment Guide** - Step-by-step production setup
- ✅ **Performance Optimized** - Caching, compression, indexing

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React 18      │    │   Slim PHP 4    │    │  Google Sheets  │
│   Frontend      │◄──►│   REST API      │◄──►│      API        │
│  (Port 5173)    │    │  (Port 8000)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Tailwind CSS   │    │  MySQL 8.0      │
│  Lucide Icons   │    │  Database       │
│  Redux Toolkit  │    │  Eloquent ORM   │
└─────────────────┘    └─────────────────┘
```

---

## 🚀 Technology Stack

### Backend

- **PHP 8.2** with Slim Framework 4
- **MySQL 8.0** with Eloquent ORM
- **JWT Authentication** (Firebase JWT)
- **Google APIs** (Sheets + OAuth)
- **PHPUnit** testing framework
- **Input Validation** (Respect/Validation)

### Frontend

- **React 18** with hooks & concurrent features
- **Redux Toolkit** for state management
- **React Router 6** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vitest** + React Testing Library
- **Vite** for blazing-fast builds

### Security & Quality

- Rate limiting middleware
- Security headers (CSP, HSTS, X-Frame-Options)
- Input sanitization & validation
- SQL injection prevention
- XSS protection
- CSRF token support
- Comprehensive test coverage
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, utility-first styling
- **Axios** for API communication

### Integration

- **Google OAuth 2.0** for secure authentication
- **Google Sheets API** for real-time data manipulation
- **RESTful API** design for clear separation of concerns

## 📋 Prerequisites

Before starting, ensure you have:

- **PHP 8.0+** installed
- **MySQL 5.7+** running
- **Node.js 16+** and npm
- **Composer** (PHP package manager)
- **XAMPP** (recommended for local development)
- **Google Cloud Console** project with OAuth credentials

## ⚡ Quick Setup Guide

### 1. Clone Repository

```bash
git clone <repository-url>
cd sheetTree
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API
   - Google+ API (for user info)
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:8000/auth/callback`
5. Note down your Client ID and Client Secret

### 3. Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Setup environment
copy .env.example .env
# Edit .env with your configurations

# Create database
mysql -u root -p -e "CREATE DATABASE sheettree_db"

# Run migrations
php database/migrate.php

# Start server (choose one method)
# Method 1: PHP built-in server
composer start

# Method 2: XAMPP (place project in htdocs)
# Access via http://localhost/sheetTree/backend/public
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configurations

# Start development server
npm run dev
```

### 5. Configure Environment Files

#### Backend (.env)

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback

DB_HOST=localhost
DB_NAME=sheettree_db
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 🎯 Features Overview

### For Users

- **Google OAuth Login** - Secure authentication with Google accounts
- **Sheet Connection** - Connect existing sheets or create new ones
- **Form Builder** - Create forms with custom fields and validation
- **Data Collection** - Public form URLs for data submission
- **Real-time Updates** - Form submissions instantly appear in Google Sheets
- **Dashboard** - Overview of sheets, forms, and submissions

### For Admins

- **User Management** - View and manage all registered users
- **System Overview** - Analytics and usage statistics
- **Data Monitoring** - View all sheets and forms across users
- **Access Control** - Enable/disable users and features

### API Features

- **RESTful Design** - Clean, predictable API endpoints
- **JWT Authentication** - Stateless, secure token-based auth
- **Input Validation** - Comprehensive data validation and sanitization
- **Error Handling** - Consistent error responses with helpful messages
- **Rate Limiting** - Prevent abuse and ensure fair usage

## 📚 API Documentation

### Base URL

```
http://localhost:8000
```

### Authentication Endpoints

```
GET  /auth/google          # Initiate Google OAuth
GET  /auth/callback        # Handle OAuth callback
POST /auth/refresh         # Refresh JWT token
POST /auth/logout          # Logout user
```

### User Endpoints

```
GET  /user/profile         # Get user profile
PUT  /user/profile         # Update user profile
GET  /user/dashboard       # Get dashboard data
```

### Sheets Endpoints

```
GET    /sheets             # Get user's sheets
POST   /sheets/connect     # Connect new sheet
DELETE /sheets/{id}        # Disconnect sheet
GET    /sheets/{id}/preview # Preview sheet data
```

### Forms Endpoints

```
GET    /forms             # Get user's forms
POST   /forms             # Create new form
GET    /forms/{id}        # Get specific form
PUT    /forms/{id}        # Update form
DELETE /forms/{id}        # Delete form
POST   /forms/{id}/submit # Submit form data
```

### Admin Endpoints (Admin Role Required)

```
GET    /admin/users       # Get all users
GET    /admin/sheets      # Get all sheets
GET    /admin/forms       # Get all forms
GET    /admin/analytics   # Get system analytics
```

## 🔧 Development Workflow

### Backend Development

```bash
cd backend

# Start with hot reload
composer start

# Run tests
composer test

# Check code style
composer cs-check

# Fix code style
composer cs-fix
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Run tests
npm run test

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 📊 Database Schema

### Core Tables

- **users** - User profiles and authentication data
- **oauth_tokens** - Google OAuth refresh tokens
- **connected_sheets** - User's connected Google Sheets
- **forms** - Custom forms configuration
- **form_submissions** - Submitted form data

### Relationships

```sql
users 1:N oauth_tokens
users 1:N connected_sheets
users 1:N forms
connected_sheets 1:N forms
forms 1:N form_submissions
```

## 🛡️ Security Features

### Authentication

- Google OAuth 2.0 with offline access
- JWT tokens with expiration
- Refresh token rotation
- CSRF protection with state parameter

### API Security

- Input validation and sanitization
- SQL injection prevention (ORM)
- XSS protection
- Rate limiting
- CORS configuration

### Data Privacy

- User data isolation
- Secure token storage
- Encrypted sensitive data
- GDPR compliance considerations

## 🚀 Deployment

### Production Checklist

#### Backend

- [ ] Set production environment variables
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure error reporting
- [ ] Enable OPcache

#### Frontend

- [ ] Build for production (`npm run build`)
- [ ] Configure production API URLs
- [ ] Set up CDN for assets
- [ ] Configure proper CSP headers
- [ ] Enable gzip compression

#### Infrastructure

- [ ] SSL certificates
- [ ] Database backups
- [ ] Monitoring and alerting
- [ ] Load balancing (if needed)

## 🧪 Testing

### Backend Tests

```bash
cd backend
composer test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Integration Tests

```bash
# Test API endpoints
npm run test:api

# Test E2E workflows
npm run test:e2e
```

## 📈 Performance Considerations

### Backend

- Database query optimization
- Redis caching for frequently accessed data
- API response caching
- Background job processing
- Connection pooling

### Frontend

- Code splitting for route-based chunks
- Image optimization and lazy loading
- Component memoization
- Virtual scrolling for large lists
- Service worker for offline functionality

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check CORS_ORIGINS in backend .env
   - Verify frontend URL matches exactly

2. **Google OAuth Fails**

   - Verify redirect URI in Google Console
   - Check client ID and secret
   - Ensure APIs are enabled

3. **Database Connection**

   - Verify MySQL is running
   - Check database credentials
   - Ensure database exists

4. **JWT Token Issues**
   - Check JWT secret is set
   - Verify token expiration settings
   - Clear localStorage if needed

### Debug Mode

```bash
# Backend debug logs
tail -f storage/logs/app.log

# Frontend debug console
# Open browser dev tools and check console
```

## 📚 Learning Resources

### Slim Framework

- [Official Documentation](https://www.slimframework.com/docs/)
- [PSR-7 HTTP Messages](https://www.php-fig.org/psr/psr-7/)
- [Dependency Injection](https://www.slimframework.com/docs/v4/concepts/di.html)

### React & Redux

- [React Documentation](https://react.dev/)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/tutorials/quick-start)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

### Google APIs

- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google API PHP Client](https://github.com/googleapis/google-api-php-client)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow PSR-12 coding standards for PHP
- Use ESLint and Prettier for JavaScript
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and descriptive

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Slim Framework** team for the excellent micro-framework
- **React** team for the powerful UI library
- **Google** for the comprehensive APIs
- **Tailwind CSS** for the utility-first styling approach
- **Redux Toolkit** team for simplifying state management

## 📧 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#🐛-troubleshooting)
2. Search existing [GitHub issues](issues)
3. Create a new issue with detailed information
4. Join our community discussions

---

**Happy coding! 🚀**
