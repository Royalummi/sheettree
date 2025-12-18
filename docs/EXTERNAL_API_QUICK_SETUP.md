# External API Quick Setup Guide

## 🚨 "Select Form" Issue - Quick Fix

### Problem

When you click "Create API", you see "Select Form" but don't understand what it's for or the dropdown is empty.

### Solution

External APIs are built on top of existing SheetTree forms. You need to create a form first!

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet
3. Add headers: `Name`, `Email`, `Message`, `Timestamp`
4. Save it

### Step 2: Connect Sheet to SheetTree

1. In SheetTree, go to "Sheets" section
2. Click "Connect New Sheet"
3. Select your Google Sheet
4. Save connection

### Step 3: Create a Form

1. Go to "Forms" section
2. Click "Create New Form"
3. Fill out:
   - **Form Name**: "Contact Form"
   - **Description**: "Website contact form"
   - **Select Sheet**: Choose your connected sheet
   - **Fields**: Add Name, Email, Message fields
   - **Validation**: Set Name and Email as required
4. Save form

### Step 4: Create External API

1. Go to "External APIs" section
2. Click "Create API"
3. Now you'll see your form in "Select Form" dropdown!
4. Choose your "Contact Form"
5. Configure API settings:
   - **API Name**: "Website Contact API"
   - **Description**: "Public API for website contact form"
   - **Rate Limits**: 10/min, 100/hour, 1000/day
   - **CORS**: Enable if using from a website
   - **Required Fields**: name, email, message
6. Create API

## 🎯 What You Get

### Your API Endpoint

```
POST /api/external/submit/{your-api-hash}
```

### Example Usage

```javascript
fetch("http://localhost:8000/api/external/submit/abc123", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello from my website!",
  }),
});
```

### Data Flow

```
External App → API → Validation → Google Sheet → Success Response
```

## 🔄 Why This Architecture?

1. **Forms First**: Forms define the data structure and validation rules
2. **Sheet Integration**: Forms are connected to Google Sheets
3. **API Layer**: External APIs expose forms as public endpoints
4. **Security**: Validation and rate limiting protect your data

## 📋 Common Use Cases

### Website Contact Form

- **Form**: Name, Email, Message
- **API**: Public endpoint for website
- **Result**: Website visitors can submit contact forms

### Mobile App Feedback

- **Form**: Rating, Comments, User ID
- **API**: Private endpoint for mobile app
- **Result**: App users can submit feedback

### Partner Integration

- **Form**: Company, Contact, Budget
- **API**: Restricted endpoint for partners
- **Result**: Partners can submit leads directly

## 🚨 Troubleshooting

### "Select Form" Dropdown is Empty

- **Cause**: No forms created yet
- **Fix**: Create a form first (see Step 3 above)

### "No Connected Sheets"

- **Cause**: No Google Sheets connected
- **Fix**: Connect a sheet first (see Step 2 above)

### API Returns 404 Error

- **Cause**: API routes not registered
- **Fix**: Check if backend routes are properly configured

### CORS Errors

- **Cause**: Browser blocking cross-origin requests
- **Fix**: Enable CORS in API settings and add your domain

## 🎨 Visual Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Google Sheet  │───▶│  SheetTree Form │───▶│  External API   │
│                 │    │                 │    │                 │
│ • Name          │    │ • Field Config  │    │ • Public URL    │
│ • Email         │    │ • Validation    │    │ • Rate Limits   │
│ • Message       │    │ • Sheet Link    │    │ • CORS Settings │
│ • Timestamp     │    │                 │    │ • Auth Options  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📚 Next Steps

1. **Test Your API**: Use the built-in test page
2. **View Documentation**: Check auto-generated docs
3. **Monitor Usage**: Watch statistics dashboard
4. **Integrate**: Add to your website or app
5. **Scale**: Create more APIs for different forms

## 🔗 Related Documentation

- [External API User Guide](EXTERNAL_API_USER_GUIDE.md) - Complete detailed guide
- [Backend README](backend/README.md) - Technical documentation
- [External API README](backend/EXTERNAL_API_README.md) - Developer guide

---

**Need Help?** Check the complete [External API User Guide](EXTERNAL_API_USER_GUIDE.md) for detailed explanations of all features and options.
