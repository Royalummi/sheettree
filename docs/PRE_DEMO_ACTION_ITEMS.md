# 🚀 Pre-Demo Action Items

## ⚡ CRITICAL (Do Before Client Demo)

### 1. Update Production JWT Secret

**File:** `backend/.env`  
**Current:**

```dotenv
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
```

**Action:**

```bash
# Generate new secret
openssl rand -base64 32

# Update in .env file
JWT_SECRET=<generated-secret-here>
```

**Time Required:** 2 minutes  
**Priority:** 🔴 HIGH

---

### 2. Enable Input Validation for External API

**File:** `backend/src/Controllers/ExternalApiController.php`  
**Line:** 106

**Current Code:**

```php
// TODO: Re-enable these features once basic submission works
// Spam protection, captcha, validation
```

**Action Required:**

```php
// Add before storing submission
use App\Validators\InputValidator;

$validator = new InputValidator();
$validationResult = $validator->validateFormSubmission($submissionData, $form->fields);

if (!$validationResult['valid']) {
    return $this->errorResponse($response, $validationResult['message'], 400);
}
```

**Time Required:** 10 minutes  
**Priority:** 🟠 MEDIUM

---

### 3. Address TODO in SheetController

**File:** `backend/src/Controllers/SheetController.php`  
**Line:** 160

**Current:**

```php
// TODO: Get actual sheet data from Google Sheets API
```

**Options:**

- **Option A:** Remove TODO comment (sheet metadata is sufficient)
- **Option B:** Implement sheet data preview

**Recommendation:** Remove TODO comment - current implementation is adequate

**Time Required:** 1 minute  
**Priority:** 🟢 LOW

---

## ✅ RECOMMENDED (Before Demo)

### 4. Run Complete Test Suite

```bash
# Run all tests
cd c:\xampp\htdocs\sheetTree
run-all-tests.bat

# Expected output:
# Backend: 24 tests passing
# Frontend: 10 tests passing
```

**Time Required:** 5 minutes  
**Priority:** 🟠 MEDIUM

---

### 5. Prepare Demo Data

**Create sample forms:**

1. Contact Form (Name, Email, Phone, Message)
2. Event Registration (Name, Email, Event Type, Date)
3. Customer Survey (Name, Rating, Feedback)

**Time Required:** 10 minutes  
**Priority:** 🟠 MEDIUM

---

### 6. Test Complete Flow

**Demo Script Test:**

1. ✅ Login with Google OAuth
2. ✅ Create form from template
3. ✅ Connect to Google Sheet
4. ✅ Preview form
5. ✅ Submit test data
6. ✅ Verify data appears in Google Sheet
7. ✅ Check form submissions dashboard
8. ✅ Test embedded form
9. ✅ Test API endpoint

**Time Required:** 15 minutes  
**Priority:** 🔴 HIGH

---

## 📋 OPTIONAL (Nice to Have)

### 7. Add CAPTCHA to Public Forms

**File:** `frontend/src/pages/Forms/PublicForm.jsx`

**Implementation:** Add Google reCAPTCHA v3

**Time Required:** 30 minutes  
**Priority:** 🟢 LOW (Can do post-launch)

---

### 8. Implement Conditional Logging

**Create:** `frontend/src/utils/logger.js`

```javascript
export const logger = {
  error: (message, error) => {
    if (import.meta.env.MODE === "development") {
      console.error(message, error);
    }
    // TODO: Send to error tracking service in production
  },
  warn: (message) => {
    if (import.meta.env.MODE === "development") {
      console.warn(message);
    }
  },
};
```

**Time Required:** 20 minutes  
**Priority:** 🟢 LOW

---

## 🎯 QUICK START CHECKLIST

Before starting the demo:

```bash
# 1. Start backend
cd c:\xampp\htdocs\sheetTree\backend
php -S localhost:8000 -t public

# 2. Start frontend (new terminal)
cd c:\xampp\htdocs\sheetTree\frontend
npm run dev

# 3. Open browser
# http://localhost:5173
```

**System Check:**

- [ ] XAMPP MySQL running
- [ ] Backend server running (http://localhost:8000)
- [ ] Frontend dev server running (http://localhost:5173)
- [ ] Google OAuth credentials configured
- [ ] Test Google Sheet created and shared

---

## 📊 Time Estimates

| Task                | Time       | Priority  |
| ------------------- | ---------- | --------- |
| JWT Secret Update   | 2 min      | 🔴 HIGH   |
| Test Suite Run      | 5 min      | 🟠 MEDIUM |
| Demo Data Prep      | 10 min     | 🟠 MEDIUM |
| Flow Testing        | 15 min     | 🔴 HIGH   |
| Input Validation    | 10 min     | 🟠 MEDIUM |
| **Total Critical:** | **32 min** | -         |

---

## 🎬 DEMO DAY PREPARATION

### 1 Day Before Demo:

- [ ] Update JWT_SECRET
- [ ] Run test suite
- [ ] Prepare demo data
- [ ] Test complete flow
- [ ] Clear any test data
- [ ] Verify Google OAuth works

### 1 Hour Before Demo:

- [ ] Start backend server
- [ ] Start frontend server
- [ ] Login and verify dashboard
- [ ] Test one form creation
- [ ] Test one form submission
- [ ] Check Google Sheet sync

### During Demo:

- [ ] Have backup plan (screenshots/video)
- [ ] Test internet connection
- [ ] Open relevant documentation
- [ ] Have Google Sheet visible in another tab
- [ ] Prepare to show code if asked

---

## 🆘 TROUBLESHOOTING

### If Tests Fail:

```bash
# Backend tests
cd backend
composer install
vendor/bin/phpunit --testdox

# Frontend tests
cd frontend
npm install
npm run test
```

### If OAuth Fails:

1. Check `.env` credentials
2. Verify redirect URI matches Google Console
3. Check CORS settings
4. Clear browser cookies

### If Google Sheets Sync Fails:

1. Verify OAuth token not expired
2. Check spreadsheet permissions
3. Test sheet access from code
4. Check Google API quota

---

## ✅ COMPLETION CHECKLIST

Before declaring "Ready for Demo":

- [ ] All critical items completed
- [ ] Test suite passing (34/34 tests)
- [ ] Demo data created
- [ ] Complete flow tested successfully
- [ ] Documentation reviewed
- [ ] Backup plan prepared
- [ ] Demo script rehearsed

---

**Status:** Ready to execute action items!  
**Estimated Time to Demo-Ready:** 45 minutes  
**Confidence Level:** Very High ✅
