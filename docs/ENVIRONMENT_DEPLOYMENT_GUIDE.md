# 📋 Environment Files Deployment Guide

**Date:** August 21, 2025
**Project:** sheets Production Deployment

## 🎯 Which .env Files Are Used When

### Frontend (React/Vite)

```
Development:
├── .env                    # Used during `npm run dev`

Build Process:
├── .env.production         # Used during `npm run build`
└── OR .env                 # If .env.production doesn't exist

After Deployment:
└── NO .env files used!     # Values are compiled into built files
```

### Backend (PHP)

```
Development:
├── .env                    # Used when running locally

Production Deployment:
├── .env                    # The ONLY file used on server
└── .env.production         # Template - must be copied to .env
```

---

## 🚀 Deployment Process

### Step 1: Frontend Deployment

**What happens:**

1. Run `npm run build` (uses `.env.production` values)
2. Upload `dist/` contents to `public_html/sheets/`
3. **No .env files needed on server** (values are compiled in)

### Step 2: Backend Deployment

**What you need to do:**

1. Upload backend files to `public_html/sheets/backend/`
2. **Copy `.env.production` to `.env` on the server**
3. Update `.env` with any server-specific values

---

## 📁 Current File Status

### ✅ Frontend Files (Ready)

- **`.env`** - Development config ✅
- **`.env.production`** - Production build config ✅
- **Ready for:** `npm run build` and deployment

### ⚠️ Backend Files (Needs Action)

- **`.env`** - Has development database config ⚠️
- **`.env.production`** - Updated production template ✅

---

## 🔧 Action Required: Update Backend .env for Production

You have two options:

### Option A: Update Current .env File

Update your current `.env` with production values:

```env
# Database Configuration - Production (Hostinger)
DB_HOST=localhost
DB_NAME=u141869393_gopafy_sheets
DB_USERNAME=u141869393_sheets_user
DB_PASSWORD=8+bUtsHJML

# JWT Configuration - Strong Production Secret
JWT_SECRET=0f2c5383cc1ce6b31d7cad4080176b6ee380d5450fdd7b557f5db0c7013e04b0
```

### Option B: Use .env.production as Template

On your Hostinger server:

1. Copy `.env.production` to `.env`
2. The file is already configured correctly

---

## 📋 Production Deployment Checklist

### Frontend ✅

- [x] **`.env.production`** configured with correct API URL
- [x] **Google Client ID** set for production
- [x] **Build ready** for `npm run build`

### Backend ⚠️

- [x] **`.env.production`** template ready
- [ ] **Copy `.env.production` to `.env`** on server
- [ ] **Verify database credentials** match Hostinger
- [ ] **Test database connection** after upload

---

## 🎯 Final Server Configuration

### On Hostinger Server (`public_html/sheets/backend/`)

You need this `.env` file:

```env
# Google OAuth Configuration - Production Ready
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret
GOOGLE_REDIRECT_URI=https://sheets.gopafy.com/backend/auth/callback

# Database Configuration - Hostinger Production
DB_HOST=localhost
DB_NAME=u141869393_gopafy_sheets
DB_USERNAME=u141869393_sheets_user
DB_PASSWORD=8+bUtsHJML

# JWT Configuration - Strong Production Secret
JWT_SECRET=0f2c5383cc1ce6b31d7cad4080176b6ee380d5450fdd7b557f5db0c7013e04b0
JWT_ALGORITHM=HS256
JWT_EXPIRY=86400

# App Configuration - Production Settings
APP_ENV=production
APP_URL=https://sheets.gopafy.com/backend
FRONTEND_URL=https://sheets.gopafy.com

# CORS Configuration - Production Domains
CORS_ORIGINS=https://sheets.gopafy.com,https://gopafy.com

# Error Reporting - Production Settings
DISPLAY_ERROR_DETAILS=false
LOG_ERRORS=true
LOG_ERROR_DETAILS=true
```

---

**🎉 Summary: Your `.env.production` files are now properly configured for deployment!**
