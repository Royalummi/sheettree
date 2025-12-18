# 🚀 sheets Frontend Deployment Guide

## For Hostinger Subdomain: sheets.gopafy.com

## 📋 Frontend Cleanup Summary

✅ **Removed Files:**

- `public/test-form.html` - API testing file (not needed in production)

✅ **Created Files:**

- `.env.production` - Production environment configuration
- Updated `vite.config.js` - Optimized build configuration

## 📦 Build Process

### Step 1: Update Production Environment

Before building, update `.env.production` with your production values:

```env
# Production Environment Configuration for sheets.gopafy.com
VITE_API_BASE_URL=https://sheets.gopafy.com/backend
VITE_GOOGLE_API_KEY=YOUR_PRODUCTION_GOOGLE_API_KEY
VITE_GOOGLE_CLIENT_ID=YOUR_PRODUCTION_GOOGLE_CLIENT_ID
VITE_APP_NAME=sheets
VITE_APP_ENV=production
```

### Step 2: Build for Production

```bash
# In your frontend directory
cd c:\xampp\htdocs\sheetTree\frontend

# Install dependencies (if not done already)
npm install

# Install Terser for minification (required for optimized builds)
npm install terser --save-dev

# Build for production
npm run build
```

This will create a `dist/` folder with your production-ready frontend.

## 📁 Expected Build Output

After running `npm run build`, you should have:

```
frontend/dist/
├── index.html                 # Main HTML file
├── assets/                    # Optimized CSS/JS files
│   ├── index-[hash].js       # Main JavaScript bundle
│   ├── index-[hash].css      # Main CSS bundle
│   ├── vendor-[hash].js      # React/ReactDOM bundle
│   ├── router-[hash].js      # React Router bundle
│   └── ui-[hash].js          # UI components bundle
└── [other static files]      # Any other static assets
```

## 🗂️ Deployment Structure

Upload the contents of `dist/` to your Hostinger subdomain:

```
public_html/sheets/            # sheets.gopafy.com root
├── index.html                 # React app entry point (from dist/)
├── assets/                    # Optimized assets (from dist/)
│   ├── index-[hash].js
│   ├── index-[hash].css
│   ├── vendor-[hash].js
│   ├── router-[hash].js
│   └── ui-[hash].js
└── backend/                   # API backend folder (already deployed)
    ├── [backend files]
```

## 🔧 Production Optimizations Made

### Build Configuration (`vite.config.js`)

- ✅ **Disabled sourcemaps** - Reduces bundle size
- ✅ **Terser minification** - Better compression
- ✅ **Code splitting** - Separate vendor, router, and UI bundles
- ✅ **Optimized chunk sizes** - Better loading performance

### Environment Configuration

- ✅ **Production API URL** - Points to `https://sheets.gopafy.com/backend`
- ✅ **Production mode** - Optimized React builds
- ✅ **Google API credentials** - Uses production OAuth settings

## 🚨 Important: Google OAuth Update Required

Before deploying, update your Google Cloud Console:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your project**
3. **Go to "APIs & Services" → "Credentials"**
4. **Edit your OAuth 2.0 Client**
5. **Update Authorized JavaScript Origins:**
   - **Add:** `https://sheets.gopafy.com`
   - **Remove:** `http://localhost:5174`
6. **Update Authorized Redirect URIs:**
   - **Add:** `https://sheets.gopafy.com/backend/auth/callback`
   - **Remove:** `http://localhost:8000/auth/callback`
7. **Save changes**

## 📝 Deployment Steps

### Quick Deployment Process:

1. **Update `.env.production` with your production credentials**
2. **Run `npm run build` in the frontend directory**
3. **Upload contents of `dist/` folder to `public_html/sheets/` on Hostinger**
4. **Ensure the main `.htaccess` file is in place (already created in backend guide)**
5. **Test the application at `https://sheets.gopafy.com/`**

## ✅ Frontend Deployment Checklist

- [ ] **Remove test files** ✅ (Done)
- [ ] **Update `.env.production`** with production values
- [ ] **Update Google OAuth credentials** in Google Cloud Console
- [ ] **Build production bundle** with `npm run build`
- [ ] **Upload dist contents** to `public_html/sheets/`
- [ ] **Verify frontend loads** at `https://sheets.gopafy.com/`
- [ ] **Test Google OAuth login**
- [ ] **Test form creation and management**
- [ ] **Test API communication** with backend

## 🔍 Frontend File Structure (Production Ready)

```
frontend/                      # Your local development
├── .env                      # Development config (localhost)
├── .env.example             # Template for others
├── .env.production          # Production config ✅ NEW
├── package.json             # Dependencies
├── vite.config.js          # Optimized build config ✅ UPDATED
├── src/                    # Source code (clean ✅)
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── config/
│   └── utils/
├── public/                 # Static files (cleaned ✅)
├── dist/                   # Build output (created after npm run build)
└── node_modules/          # Dependencies (not deployed)
```

## 🎯 What Gets Deployed

**✅ Deploy to Hostinger:**

- Contents of `dist/` folder only
- Optimized, minified, production-ready files

**❌ Do NOT deploy:**

- `node_modules/` folder
- Source code (`src/` folder)
- Configuration files (`.env`, `package.json`, etc.)
- Development files

---

**🎉 Your frontend is now production-ready and optimized for deployment!**

**Total cleanup: 1 file removed, 2 files optimized**
**Estimated build time: 2-5 minutes**
**Estimated deployment time: 5-10 minutes**
