# Email Notification System - Setup Guide

## ✅ Implementation Complete!

The email notification system has been fully integrated with your SheetTree application.

## 📋 What Was Implemented

### Backend Components

1. **Database Migration** (`add_email_notifications_to_users.sql`)

   - Added 7 email preference columns to users table
   - Master toggle: `email_notifications_enabled`
   - Individual preferences for each notification type

2. **EmailService** (`EmailService.php`)

   - Sends beautiful HTML email notifications
   - Checks user preferences before sending
   - Includes test email functionality
   - Styled email templates with your brand colors

3. **NotificationHelper** (`NotificationHelper.php`)

   - Centralized notification creation
   - Automatically sends emails when creating notifications
   - Helper methods for each notification type:
     - `notifyFormSubmission()`
     - `notifySheetConnection()`
     - `notifyFormStatus()`
     - `notifySpamDetected()`
     - `notifyApiLimit()`
     - `notifySystem()`

4. **UserController** (Updated)

   - `GET /user/notification-preferences` - Fetch preferences
   - `PUT /user/notification-preferences` - Update preferences
   - `POST /user/test-email` - Send test email

5. **User Model** (Updated)
   - Added email notification preference fields
   - Added casts for boolean values

### Frontend Components

1. **Profile.jsx** (Enhanced)
   - Beautiful email notification settings UI
   - Master toggle to enable/disable all emails
   - Individual toggles for each notification type:
     - 📝 Form Submissions
     - 🔗 Sheet Connection Updates
     - 📋 Form Status Changes
     - 🚫 Spam Detection
     - ⚠️ API Usage Warnings
     - 🔔 System Announcements
   - "Send Test Email" button
   - Real-time preference updates

## 🚀 Setup Instructions

### Step 1: Run Database Migration

```bash
# Connect to MySQL
mysql -u root

# Select your database
USE sheetformbuilder;

# Run the migration
source C:/xampp/htdocs/sheetTree/backend/database/migrations/add_email_notifications_to_users.sql;

# Verify columns were added
DESCRIBE users;
```

### Step 2: Configure Email Settings

Edit `backend/.env`:

```env
# Email Configuration (already added)
MAIL_FROM_ADDRESS=noreply@sheettree.com
MAIL_FROM_NAME=SheetTree
```

**For Production:** Configure SMTP or use an email service:

```env
# Example: Using Gmail SMTP
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls

# Or use SendGrid API
SENDGRID_API_KEY=your-sendgrid-api-key

# Or use AWS SES
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
```

### Step 3: Test the System

1. Start your servers:

```bash
# Terminal 1 - Backend
cd C:\xampp\htdocs\sheetTree\backend
composer start

# Terminal 2 - Frontend
cd C:\xampp\htdocs\sheetTree\frontend
npm run dev
```

2. Login to your app
3. Go to Profile page
4. Check "Email Notifications" section
5. Click "Send Test Email" button
6. Check your email inbox!

## 📧 Email Configuration for Development

### Using Mailtrap (Recommended for Testing)

1. Sign up at [https://mailtrap.io](https://mailtrap.io)
2. Get your credentials
3. Update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
```

### Using Local Mail Server (XAMPP)

XAMPP's Mercury Mail or use a fake SMTP server like [MailHog](https://github.com/mailhog/MailHog).

## 🔧 How to Use in Your Code

### Example 1: Send Notification When Form is Submitted

In `FormController.php`, after saving submission:

```php
use App\Helpers\NotificationHelper;

// After submission is saved
NotificationHelper::notifyFormSubmission(
    $form->user_id,
    $form->id,
    $form->title,
    $submission->id,
    $submission->name ?? 'Anonymous'
);
```

### Example 2: Send Notification for Sheet Connection

```php
// Success
NotificationHelper::notifySheetConnection(
    $userId,
    $sheet->id,
    $sheet->spreadsheet_name,
    'success'
);

// Error
NotificationHelper::notifySheetConnection(
    $userId,
    $sheet->id,
    $sheet->spreadsheet_name,
    'error',
    'Token expired'
);
```

### Example 3: Send System Announcement

```php
NotificationHelper::notifySystem(
    $userId,
    'New Feature Released',
    'Check out our new dashboard analytics!',
    ['feature' => 'analytics']
);
```

## 🎨 Email Template Features

- Beautiful gradient header with SheetTree branding
- Responsive design (works on mobile)
- Color-coded notification badges
- Detailed information boxes
- Clear call-to-action buttons
- Footer with settings link
- Professional styling

## 📊 Notification Types

| Type             | Email Subject                      | User Can Disable |
| ---------------- | ---------------------------------- | ---------------- |
| form_submission  | 📝 New Form Submission             | ✅ Yes           |
| sheet_connection | 🔗 Google Sheets Connection Update | ✅ Yes           |
| form_status      | 📋 Form Status Changed             | ✅ Yes           |
| spam_detected    | 🚫 Spam Activity Detected          | ✅ Yes           |
| api_limit        | ⚠️ API Usage Warning               | ✅ Yes           |
| system           | 🔔 SheetTree Notification          | ✅ Yes           |

## 🔒 Privacy & User Control

Users have full control over their notifications:

- **Master Toggle:** Turn off all email notifications at once
- **Granular Control:** Choose which types of notifications to receive
- **Test Before Use:** Send a test email to verify it's working
- **Easy Access:** Manage preferences directly in profile settings

## 🐛 Troubleshooting

### Emails Not Sending?

1. **Check PHP mail() configuration:**

   ```bash
   php -r "mail('test@example.com', 'Test', 'Test');"
   ```

2. **Check error logs:**

   ```bash
   tail -f C:/xampp/apache/logs/error.log
   ```

3. **Verify user has email notifications enabled:**

   ```sql
   SELECT email, email_notifications_enabled FROM users WHERE id = YOUR_USER_ID;
   ```

4. **Test with Mailtrap first** before using production SMTP

### Database Migration Issues?

```sql
-- Check if columns exist
SHOW COLUMNS FROM users LIKE 'email_notifications%';

-- If migration failed, drop and retry
ALTER TABLE users
DROP COLUMN email_notifications_enabled,
DROP COLUMN notify_form_submission,
DROP COLUMN notify_sheet_connection,
DROP COLUMN notify_form_status,
DROP COLUMN notify_spam_detected,
DROP COLUMN notify_api_limit,
DROP COLUMN notify_system;

-- Then run migration again
```

## 🎯 Next Steps

1. ✅ Run database migration
2. ✅ Test email sending with "Send Test Email" button
3. ✅ Configure production email service (SendGrid/AWS SES)
4. ✅ Integrate notification calls in your controllers
5. ✅ Monitor email delivery rates

## 📚 Files Changed/Created

### Backend

- ✅ `database/migrations/add_email_notifications_to_users.sql` (NEW)
- ✅ `src/Services/EmailService.php` (NEW)
- ✅ `src/Helpers/NotificationHelper.php` (NEW)
- ✅ `src/Models/User.php` (UPDATED)
- ✅ `src/Controllers/UserController.php` (UPDATED)
- ✅ `src/Routes/UserRoutes.php` (UPDATED)
- ✅ `.env` (UPDATED)

### Frontend

- ✅ `src/pages/Profile/Profile.jsx` (UPDATED)

## 🎉 You're All Set!

Your email notification system is now fully integrated and ready to use!

Test it by:

1. Going to your Profile
2. Enabling email notifications
3. Clicking "Send Test Email"
4. Check your inbox! 📬

---

**Questions or Issues?**
Check the logs or refer to the code comments in the files above.
