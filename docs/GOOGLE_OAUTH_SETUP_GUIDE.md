# Google OAuth Setup Guide - Fix redirect_uri_mismatch Error

## Error Explanation

The `Error 400: redirect_uri_mismatch` occurs when the redirect URI used in your application doesn't match the authorized redirect URIs configured in your Google Cloud Console project.

---

## Step-by-Step Setup Guide

### Step 1: Access Google Cloud Console

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If you don't have a project yet, create one:
   - Click on the project dropdown at the top
   - Click **"NEW PROJECT"**
   - Enter a project name (e.g., "SheetTree App")
   - Click **"CREATE"**

---

### Step 2: Enable Required APIs

1. In the left sidebar, navigate to **"APIs & Services"** → **"Library"**
2. Search for and enable the following APIs:
   - **Google Sheets API**
     - Click on "Google Sheets API"
     - Click **"ENABLE"**
   - **Google Drive API** (if you're using Drive Picker)
     - Click on "Google Drive API"
     - Click **"ENABLE"**

---

### Step 3: Configure OAuth Consent Screen

1. Navigate to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** user type (unless you have Google Workspace)
3. Click **"CREATE"**

#### 3.1: App Information

Fill in the required fields:

- **App name**: `SheetTree` (or your app name)
- **User support email**: Select your email
- **App logo**: (Optional) Upload your app logo
- **Application home page**: `http://localhost:5173` (for development)
- **Application privacy policy link**: (Optional for development)
- **Application terms of service link**: (Optional for development)
- **Authorized domains**: Leave empty for localhost development
- **Developer contact information**: Enter your email

Click **"SAVE AND CONTINUE"**

#### 3.2: Scopes

1. Click **"ADD OR REMOVE SCOPES"**
2. Add the following scopes:

   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/drive.readonly` (if using Drive Picker)
   - `openid`

3. Click **"UPDATE"**
4. Click **"SAVE AND CONTINUE"**

#### 3.3: Test Users (Development Only)

1. Click **"ADD USERS"**
2. Add your email address and any other test users
3. Click **"SAVE AND CONTINUE"**

#### 3.4: Summary

Review your settings and click **"BACK TO DASHBOARD"**

---

### Step 4: Create OAuth 2.0 Credentials

1. Navigate to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Select **"Web application"** as the application type
4. Configure the OAuth client:

#### 4.1: Name

- **Name**: `SheetTree Web Client` (or any name you prefer)

#### 4.2: Authorized JavaScript Origins

Add the following URIs (click **"+ ADD URI"** for each):

```
http://localhost:5173
http://localhost:5174
http://localhost:3000
```

**For Production:**

```
https://yourdomain.com
```

#### 4.3: Authorized Redirect URIs

Add the following URIs (click **"+ ADD URI"** for each):

**CRITICAL - This is what fixes your error:**

**For Local Development:**

```
http://localhost:8000/auth/callback
```

**For Production (sheets.gopafy.com):**

```
https://sheets.gopafy.com/api.php?path=auth/callback
https://sheets.gopafy.com
```

**Note:** You need to add the redirect URI that matches your current environment. For local development, use `http://localhost:8000/auth/callback`

5. Click **"CREATE"**

---

### Step 5: Save Your Credentials

After creating the OAuth client, you'll see a modal with:

- **Client ID**: A long string ending with `.apps.googleusercontent.com`
- **Client Secret**: A shorter string

**Important:** Copy both values immediately!

---

### Step 6: Configure Your Application

#### 6.1: Backend Configuration (.env)

1. Navigate to: `c:\xampp\htdocs\sheetTree\backend\.env`
2. Update these values:

```env
GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback
```

**Important Notes:**

- Replace `your_actual_client_id_here` with your real Client ID
- Replace `your_actual_client_secret_here` with your real Client Secret
- Keep the redirect URI exactly as `http://localhost:8000/auth/callback`

#### 6.2: Frontend Configuration (.env)

1. Navigate to: `c:\xampp\htdocs\sheetTree\frontend\.env`
2. Update this value:

```env
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
```

**Important:** Use the SAME Client ID as in the backend!

---

### Step 7: Verify Redirect URI Matches

The redirect URI must match EXACTLY in three places:

1. **Google Cloud Console**: `http://localhost:8000/auth/callback`
2. **Backend .env**: `GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback`
3. **Your Application Code**: The OAuth flow must use this exact URI

**Common Mistakes:**

- ❌ `http://localhost:8000/auth/callback/` (trailing slash)
- ❌ `http://localhost:8000/callback` (missing /auth)
- ❌ `https://localhost:8000/auth/callback` (https instead of http)
- ❌ `http://127.0.0.1:8000/auth/callback` (127.0.0.1 instead of localhost)
- ✅ `http://localhost:8000/auth/callback` (CORRECT)

---

### Step 8: Restart Your Application

After updating the .env files:

1. **Stop the backend server** (Ctrl+C in terminal)
2. **Stop the frontend server** (Ctrl+C in terminal)
3. **Restart backend**:
   ```powershell
   cd c:\xampp\htdocs\sheetTree\backend
   php -S localhost:8000 -t public
   ```
4. **Restart frontend**:
   ```powershell
   cd c:\xampp\htdocs\sheetTree\frontend
   npm run dev
   ```

---

### Step 9: Test the Connection

1. Open your browser and go to: `http://localhost:5173`
2. Click **"Connect with Google"**
3. You should see the Google OAuth consent screen
4. Select your account
5. Grant the requested permissions
6. You should be redirected back to your application successfully

---

## Troubleshooting

### Issue 1: Still Getting redirect_uri_mismatch

**Solutions:**

1. Double-check the redirect URI in Google Console matches exactly
2. Wait 5-10 minutes after making changes (Google caches credentials)
3. Clear your browser cache and cookies
4. Try in an incognito/private window
5. Check for typos in your .env files
6. Ensure no extra spaces before/after values in .env

### Issue 2: "Access blocked: This app's request is invalid"

**Solutions:**

1. Make sure you added your email as a test user in the OAuth consent screen
2. Verify all required scopes are added
3. Check that APIs are enabled (Google Sheets API, Google Drive API)

### Issue 3: Invalid Client Error

**Solutions:**

1. Verify the Client ID and Client Secret are correct
2. Ensure you're using the same Client ID in both frontend and backend
3. Check that the credentials haven't been deleted or regenerated

### Issue 4: CORS Error

**Solutions:**

1. Check `CORS_ORIGINS` in backend .env includes your frontend URL
2. Verify `FRONTEND_URL` is set correctly in backend .env
3. Restart the backend server after changes

---

## Production Deployment Checklist

When deploying to production:

### 1. Update OAuth Consent Screen

- Change to "Published" status
- Add your production domain to authorized domains
- Update privacy policy and terms of service links

### 2. Update Authorized URIs in Google Console

```
JavaScript origins:
- https://yourdomain.com

Redirect URIs:
- https://yourdomain.com/api/auth/callback
- https://yourdomain.com
```

### 3. Update Environment Variables

**Backend .env:**

```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/callback
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

**Frontend .env:**

```env
VITE_API_BASE_URL=https://yourdomain.com/api
```

### 4. Security Notes

- **NEVER** commit .env files to version control
- Use environment variables in your hosting platform
- Regenerate JWT_SECRET for production
- Use HTTPS only in production
- Consider rate limiting for OAuth endpoints

---

## Quick Reference

### Where to Find Each Setting

| Setting              | Location                                                   |
| -------------------- | ---------------------------------------------------------- |
| Client ID & Secret   | Google Console → APIs & Services → Credentials             |
| Redirect URIs        | Google Console → Credentials → Your OAuth Client → Edit    |
| Authorized Origins   | Google Console → Credentials → Your OAuth Client → Edit    |
| OAuth Consent Screen | Google Console → APIs & Services → OAuth consent screen    |
| Enabled APIs         | Google Console → APIs & Services → Enabled APIs & services |
| Test Users           | Google Console → OAuth consent screen → Test users         |

### Important URLs

- Google Cloud Console: https://console.cloud.google.com/
- API Library: https://console.cloud.google.com/apis/library
- Credentials: https://console.cloud.google.com/apis/credentials
- OAuth Consent: https://console.cloud.google.com/apis/credentials/consent

---

## Support

If you continue to experience issues:

1. Check the browser console (F12) for detailed error messages
2. Check backend logs for OAuth-related errors
3. Verify network requests in the Network tab (F12)
4. Ensure your Google account has access to create projects
5. Try creating a new OAuth client from scratch

---

**Last Updated:** November 18, 2025
**Compatible With:** SheetTree Application v1.0
**Google OAuth 2.0 Version:** Latest
