# 🔧 FRONTEND UPDATE PLAN

**Date:** August 22, 2025
**Status:** Updating frontend to use API gateway

## ✅ **Current Status**

Your `.env` file is already updated:

```
VITE_API_BASE_URL=https://sheets.gopafy.com/api.php
```

## 🔧 **Files Updated**

### 1. API Service Updated ✅

- Modified `src/services/api.js` to transform URLs for API gateway
- All API calls now automatically use `?path=` format

### 2. Google OAuth Callback URL

**Update your Google Cloud Console OAuth settings:**

**Current callback URL (needs change):**

```
https://sheets.gopafy.com/backend/auth/callback
```

**New callback URL (use this):**

```
https://sheets.gopafy.com/api.php?path=auth/callback
```

## 🎯 **How It Works Now**

### Frontend API Calls:

```javascript
// Your existing code works unchanged:
api.get("/auth/google")         → https://sheets.gopafy.com/api.php?path=auth/google
api.get("/user/profile")        → https://sheets.gopafy.com/api.php?path=user/profile
api.post("/sheets/create", {})  → https://sheets.gopafy.com/api.php?path=sheets/create
```

### OAuth Flow:

1. User clicks "Sign in with Google"
2. Frontend calls `/auth/google` → API gateway → Your backend
3. Backend returns Google OAuth URL with callback: `api.php?path=auth/callback`
4. User authenticates with Google
5. Google redirects to: `api.php?path=auth/callback&code=...`
6. API gateway routes to your backend OAuth handler
7. Backend processes and redirects to frontend with token

## 🚀 **Testing Your Updated Frontend**

### 1. Build and Deploy Frontend

```bash
cd frontend
npm run build
```

### 2. Upload dist folder contents to:

```
public_html/sheets/
```

### 3. Test OAuth Flow

1. Visit: `https://sheets.gopafy.com`
2. Click "Sign in with Google"
3. Complete authentication
4. Should redirect back with token

## ✅ **Files Ready for Production**

- ✅ **Backend:** Working via API gateway
- ✅ **Frontend:** Updated API configuration
- ✅ **Environment:** Production configuration set
- 🔄 **Google OAuth:** Update callback URL in console

## 📝 **Next Steps**

1. **Update Google OAuth callback URL** to `api.php?path=auth/callback`
2. **Build and deploy frontend**
3. **Test complete OAuth flow**
4. **Launch your "sheets" application!** 🚀
