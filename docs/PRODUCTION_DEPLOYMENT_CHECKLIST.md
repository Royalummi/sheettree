# 🚀 Production Deployment Checklist

## SheetTree - Client-Ready Deployment Guide

---

## ✅ Pre-Deployment Checklist

### 1. Code Quality & Testing

- [x] **Backend Tests Setup**

  - PHPUnit configured with test database
  - Unit tests for Models (User, Form, FormTemplate)
  - Integration tests for API endpoints
  - Test coverage reports available
  - Run: `cd backend && vendor/bin/phpunit`

- [x] **Frontend Tests Setup**

  - Vitest + React Testing Library configured
  - Component tests (Toast, TemplateSelector)
  - Test coverage reports available
  - Run: `cd frontend && npm test`

- [x] **Input Validation**

  - Comprehensive InputValidator class created
  - Form creation/update validation
  - Form submission validation
  - Email and URL validation
  - Sanitization utilities

- [x] **Security Enhancements**

  - Rate limiting middleware implemented
  - Security headers middleware created
  - SecurityUtil helper functions
  - XSS prevention
  - SQL injection detection
  - CSRF token support

- [ ] **Run All Tests**

  ```bash
  # Backend
  cd backend
  vendor\bin\phpunit --testdox

  # Frontend
  cd frontend
  npm test
  ```

---

### 2. Environment Configuration

- [ ] **Backend .env File** (`backend/.env.production`)

  ```env
  # CRITICAL: Change these values!
  GOOGLE_CLIENT_ID=your_production_client_id
  GOOGLE_CLIENT_SECRET=your_production_client_secret
  GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback

  # Database (use strong credentials!)
  DB_HOST=your_production_db_host
  DB_NAME=sheettree_production
  DB_USERNAME=secure_username
  DB_PASSWORD=strong_random_password_here

  # JWT (generate new secret!)
  JWT_SECRET=generate_32_char_random_string_here
  JWT_ALGORITHM=HS256
  JWT_EXPIRY=86400

  # App
  APP_ENV=production
  APP_URL=https://yourdomain.com
  FRONTEND_URL=https://yourdomain.com

  # CORS
  CORS_ORIGINS=https://yourdomain.com
  ```

- [ ] **Frontend .env File** (`frontend/.env.production`)

  ```env
  VITE_API_URL=https://yourdomain.com/api.php
  VITE_APP_ENV=production
  ```

- [ ] **Generate New JWT Secret**
  ```bash
  # Run this to generate secure secret
  openssl rand -hex 32
  ```

---

### 3. Database Setup

- [ ] **Create Production Database**

  ```bash
  mysql -u root -p -e "CREATE DATABASE sheettree_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  ```

- [ ] **Run Migrations**

  ```bash
  mysql -u root -p sheettree_production < backend/database/migrations/*.sql
  ```

- [ ] **Seed Form Templates**

  ```bash
  mysql -u root -p sheettree_production < backend/database/seeds/form_templates_seed.sql
  ```

- [ ] **Create Database User (Production)**

  ```sql
  CREATE USER 'sheettree_user'@'localhost' IDENTIFIED BY 'strong_password';
  GRANT SELECT, INSERT, UPDATE, DELETE ON sheettree_production.* TO 'sheettree_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

- [ ] **Test Database Connection**
  ```bash
  mysql -u sheettree_user -p sheettree_production -e "SHOW TABLES;"
  ```

---

### 4. Backend Deployment

- [ ] **Install Dependencies**

  ```bash
  cd backend
  composer install --no-dev --optimize-autoloader
  ```

- [ ] **Create Required Directories**

  ```bash
  mkdir -p backend/storage
  chmod 755 backend/storage
  ```

- [ ] **Configure Apache/Nginx**

  **Apache (.htaccess in backend/public/)**:

  ```apache
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.php [QSA,L]

  # Enable HTTPS redirect
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Security headers
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  ```

  **Nginx (server block)**:

  ```nginx
  server {
      listen 80;
      server_name yourdomain.com;
      return 301 https://$server_name$request_uri;
  }

  server {
      listen 443 ssl http2;
      server_name yourdomain.com;

      ssl_certificate /path/to/cert.pem;
      ssl_certificate_key /path/to/key.pem;

      root /var/www/sheettree/backend/public;
      index index.php;

      location / {
          try_files $uri $uri/ /index.php?$query_string;
      }

      location ~ \.php$ {
          fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
          fastcgi_index index.php;
          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
          include fastcgi_params;
      }

      location ~ /\.env {
          deny all;
      }
  }
  ```

- [ ] **File Permissions**

  ```bash
  # Web server should own files
  chown -R www-data:www-data backend/

  # Secure permissions
  find backend -type d -exec chmod 755 {} \;
  find backend -type f -exec chmod 644 {} \;
  chmod 600 backend/.env
  chmod 755 backend/storage
  ```

- [ ] **Test Backend API**
  ```bash
  curl https://yourdomain.com/api.php?path=templates
  ```

---

### 5. Frontend Deployment

- [ ] **Install Dependencies**

  ```bash
  cd frontend
  npm ci --production
  ```

- [ ] **Build Production Bundle**

  ```bash
  npm run build
  ```

- [ ] **Deploy Build Files**

  - Copy `frontend/dist/*` to web server
  - Configure server to serve SPA (see below)

- [ ] **Configure Server for SPA**

  **Apache (.htaccess in frontend root)**:

  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>
  ```

  **Nginx**:

  ```nginx
  server {
      listen 443 ssl http2;
      server_name yourdomain.com;

      root /var/www/sheettree/frontend/dist;
      index index.html;

      location / {
          try_files $uri $uri/ /index.html;
      }

      # Cache static assets
      location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
          expires 1y;
          add_header Cache-Control "public, immutable";
      }
  }
  ```

- [ ] **Test Frontend**
  ```bash
  curl https://yourdomain.com
  ```

---

### 6. Security Hardening

- [ ] **SSL/TLS Certificate**

  - Install Let's Encrypt certificate: `certbot --nginx -d yourdomain.com`
  - Configure auto-renewal
  - Test SSL: https://www.ssllabs.com/ssltest/

- [ ] **Firewall Rules**

  ```bash
  # UFW (Ubuntu)
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw enable
  ```

- [ ] **Hide Server Information**

  - Apache: `ServerTokens Prod` in httpd.conf
  - Nginx: `server_tokens off;` in nginx.conf
  - PHP: `expose_php = Off` in php.ini

- [ ] **Database Security**

  - Disable remote root access
  - Use strong passwords
  - Enable binary logging for backups
  - Regular security updates

- [ ] **File Upload Security** (if applicable)
  - Restrict file types
  - Scan for malware
  - Store outside web root
  - Generate random filenames

---

### 7. Performance Optimization

- [ ] **Enable PHP OpCache**

  ```ini
  ; php.ini
  opcache.enable=1
  opcache.memory_consumption=128
  opcache.interned_strings_buffer=8
  opcache.max_accelerated_files=4000
  opcache.revalidate_freq=60
  ```

- [ ] **Enable Gzip Compression**

  ```apache
  # Apache
  <IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
  </IfModule>
  ```

- [ ] **Browser Caching**

  ```apache
  # Apache
  <IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
  </IfModule>
  ```

- [ ] **Database Optimization**

  ```sql
  -- Add indexes for common queries
  CREATE INDEX idx_user_email ON users(email);
  CREATE INDEX idx_form_user ON forms(user_id);
  CREATE INDEX idx_submission_form ON form_submissions(form_id);
  CREATE INDEX idx_submission_date ON form_submissions(submitted_at);
  ```

- [ ] **Frontend Optimization**
  - Minification (done by Vite build)
  - Code splitting (configured)
  - Lazy loading for routes
  - Image optimization

---

### 8. Monitoring & Logging

- [ ] **Error Logging**

  ```php
  // php.ini
  log_errors = On
  error_log = /var/log/php/error.log
  ```

- [ ] **Access Logs**

  - Apache: `/var/log/apache2/access.log`
  - Nginx: `/var/log/nginx/access.log`

- [ ] **Application Monitoring** (Recommended)

  - Sentry for error tracking
  - New Relic for performance
  - Google Analytics for usage

- [ ] **Database Backups**

  ```bash
  # Daily backup script
  #!/bin/bash
  mysqldump -u root -p sheettree_production > /backups/db_$(date +%Y%m%d).sql
  find /backups -name "db_*.sql" -mtime +7 -delete
  ```

- [ ] **Health Check Endpoint**
  - Create `/health` endpoint
  - Monitor uptime with UptimeRobot or Pingdom

---

### 9. Google OAuth Configuration

- [ ] **Google Cloud Console**

  1. Go to: https://console.cloud.google.com
  2. Create new project or select existing
  3. Enable Google Sheets API
  4. Enable Google+ API
  5. Create OAuth 2.0 credentials
  6. Add authorized redirect URIs:
     - `https://yourdomain.com/auth/callback`
  7. Add authorized JavaScript origins:
     - `https://yourdomain.com`

- [ ] **Update .env with Google Credentials**

- [ ] **Test OAuth Flow**
  - Visit `/auth/google`
  - Complete OAuth
  - Verify token generation
  - Test API access

---

### 10. Final Testing

- [ ] **Manual Testing**

  - [ ] User registration/login
  - [ ] Create form
  - [ ] Edit form
  - [ ] Delete form
  - [ ] Connect Google Sheet
  - [ ] Submit form (public)
  - [ ] View submissions
  - [ ] Set up notifications
  - [ ] Test email notifications
  - [ ] Test webhook notifications
  - [ ] Browse form templates
  - [ ] Use template
  - [ ] Export data

- [ ] **Security Testing**

  - [ ] Test rate limiting
  - [ ] Test input validation
  - [ ] Test XSS prevention
  - [ ] Test SQL injection prevention
  - [ ] Test CORS headers
  - [ ] Test authentication
  - [ ] Test authorization

- [ ] **Performance Testing**

  - [ ] Load testing with Apache Bench or k6
  - [ ] Check response times
  - [ ] Monitor resource usage
  - [ ] Test under concurrent load

- [ ] **Browser Testing**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
  - [ ] Mobile browsers

---

### 11. Documentation

- [x] **API Documentation** (`API_DOCUMENTATION.md`)
- [x] **Deployment Guide** (this file)
- [ ] **User Guide** (create if needed)
- [ ] **Admin Guide** (create if needed)
- [ ] **Troubleshooting Guide**

---

### 12. Go-Live Checklist

- [ ] **DNS Configuration**

  - Point domain to server IP
  - Wait for DNS propagation (up to 48 hours)

- [ ] **SSL Certificate Active**

- [ ] **All Environment Variables Set**

- [ ] **Database Configured & Seeded**

- [ ] **Backend API Responding**

- [ ] **Frontend Loading**

- [ ] **Google OAuth Working**

- [ ] **Notifications Working**

- [ ] **Backups Scheduled**

- [ ] **Monitoring Active**

- [ ] **Client Demo Prepared**

---

## 📊 Demo Preparation

### Client Showcase Features

1. **User Experience**

   - Smooth Google OAuth login
   - Intuitive form builder
   - Professional template library
   - Real-time form preview
   - Easy submission viewing

2. **Key Features to Demonstrate**

   - Create form from scratch
   - Use pre-built template
   - Connect to Google Sheets
   - Set up email notifications
   - Set up webhook notifications
   - View submissions
   - Form analytics

3. **Technical Highlights**

   - Production-ready architecture
   - Comprehensive testing (backend + frontend)
   - Security best practices
   - Rate limiting protection
   - Input validation
   - Error handling
   - API documentation

4. **Performance Metrics**
   - Fast page load times
   - Responsive design
   - Mobile-friendly
   - SEO optimized

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: "Database connection failed"

- Check DB credentials in `.env`
- Verify database exists
- Test connection manually

**Issue**: "OAuth redirect mismatch"

- Check Google Console redirect URIs
- Verify GOOGLE_REDIRECT_URI in `.env`

**Issue**: "CORS error"

- Check CORS_ORIGINS in `.env`
- Verify frontend URL matches

**Issue**: "Rate limit exceeded"

- Increase limits in RateLimitMiddleware
- Clear rate limit cache

**Issue**: "Form submission not saving to sheet"

- Check OAuth token expiry
- Verify Google Sheets API enabled
- Test sheet permissions

---

## 📞 Support

For deployment support:

- Review error logs
- Check server configuration
- Verify all checklist items
- Test in staging environment first

---

## 🎉 Post-Deployment

After successful deployment:

1. Monitor error logs for 24 hours
2. Collect user feedback
3. Plan iterative improvements
4. Schedule regular backups
5. Set up automated testing in CI/CD
6. Document any customizations

---

**Last Updated**: December 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
