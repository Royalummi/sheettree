# Quick Fix - Google OAuth redirect_uri_mismatch Error

## The Problem

You're seeing: `Error 400: redirect_uri_mismatch` with `redirect_uri=https://sheets.gopafy.com/api.php?path=auth/callback`

**Root Cause:** Your Google Cloud Console is configured with the production redirect URI, but you're developing locally.

---

## Immediate Solution

### Step 1: Add Local Redirect URI to Google Console

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID: **SheetTree Web Client**
3. Scroll to **"Authorized redirect URIs"**
4. Click **"+ ADD URI"**
5. Add this EXACT URI:
   ```
   http://localhost:8000/auth/callback
   ```
6. Click **"SAVE"**
7. **Wait 5-10 minutes** for Google to propagate the changes

### Step 2: Verify Your .env Files (Already Updated)

✅ **Backend .env** is now configured for local development:

```env
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
APP_ENV=development
```

✅ **Frontend .env** is now configured for local development:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENV=development
```

### Step 3: Restart Your Servers

Run these commands:

```powershell
# Backend
cd c:\xampp\htdocs\sheetTree\backend
php -S localhost:8000 -t public

# Frontend (in a new terminal)
cd c:\xampp\htdocs\sheetTree\frontend
npm run dev
```

---

## What Should Be in Google Console

Your Google OAuth Client should have these redirect URIs:

### For Local Development:

- `http://localhost:8000/auth/callback` ✅ **ADD THIS NOW**

### For Production (Already There):

- `https://sheets.gopafy.com/api.php?path=auth/callback`
- `https://sheets.gopafy.com`

**You can have BOTH** - they won't conflict!

---

## Testing After Setup

1. Wait 5-10 minutes after adding the local redirect URI
2. Clear your browser cache and cookies
3. Open: http://localhost:5173
4. Click "Connect with Google"
5. You should see the Google consent screen (not an error)

---

## Switching Between Local and Production

### When Developing Locally:

Use the `.env` files as they are NOW (already updated to local)

### When Deploying to Production:

Change these values:

**Backend .env:**

```env
GOOGLE_REDIRECT_URI=https://sheets.gopafy.com/api.php?path=auth/callback
APP_URL=https://sheets.gopafy.com
FRONTEND_URL=https://sheets.gopafy.com
APP_ENV=production
CORS_ORIGINS=https://sheets.gopafy.com,https://gopafy.com
```

**Frontend .env:**

```env
VITE_API_BASE_URL=https://sheets.gopafy.com/api.php
VITE_APP_ENV=production
```

---

## Common Issues After Adding Redirect URI

### "Still getting redirect_uri_mismatch"

- Wait 10 minutes (Google caches credentials)
- Clear browser cache
- Try incognito/private window
- Verify you saved the redirect URI in Google Console
- Check for typos (http vs https, trailing slashes, etc.)

### "This app's request is invalid"

- Make sure you added your email as a test user
- Verify Google Sheets API is enabled
- Check that your Client ID hasn't been regenerated

### "Invalid client"

- Verify Client ID in both backend and frontend .env match
- Check Client Secret is correct in backend .env
- Ensure credentials weren't deleted/regenerated

---

## Your Current Google Console Setup

**Project:** SheetTree (or similar)

**OAuth Client ID:** 258941583790-ofln8rnonmlfl1bp4l72g1rf59ia5d2h.apps.googleusercontent.com

**Should Have These Redirect URIs:**

1. ✅ `https://sheets.gopafy.com/api.php?path=auth/callback` (Production)
2. ✅ `https://sheets.gopafy.com` (Production)
3. ❓ `http://localhost:8000/auth/callback` (Local - **ADD THIS**)

**Authorized JavaScript Origins:**

1. ✅ `https://sheets.gopafy.com` (Production)
2. ❓ `http://localhost:5173` (Local - Add if missing)

---

## Screenshot Guide

### Where to Add Redirect URI:

1. **Navigate to Credentials:**

   ```
   Google Cloud Console → APIs & Services → Credentials
   ```

2. **Click Your OAuth Client:**
   Look for "SheetTree Web Client" or similar name

3. **Scroll to "Authorized redirect URIs" section:**
   You'll see your production URIs listed

4. **Click "+ ADD URI":**
   Enter: `http://localhost:8000/auth/callback`

5. **Click "SAVE":**
   Bottom of the page

---

**Last Updated:** November 18, 2025
**Status:** .env files updated, waiting for Google Console update
