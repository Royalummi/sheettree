# Notification System Implementation Guide

## Overview

This document provides a complete guide to implementing the notifications system in SheetTree.

## ✅ What's Already Done

### Frontend Components

1. **NotificationDropdown.jsx** - Complete UI component with:

   - Bell icon with unread count badge
   - Dropdown menu with notifications list
   - Mark as read functionality
   - Clear notifications
   - Click to navigate to related forms
   - Timestamp formatting

2. **notificationsSlice.js** - Redux state management with:
   - Async thunks for API calls
   - State management for notifications and unread count
   - Real-time notification support via `addNotification` action

### Backend Structure

1. **NotificationController.php** - Complete controller with:

   - Get notifications (with pagination and filters)
   - Mark as read (single and all)
   - Delete notifications (single and all)
   - Static helper method to create notifications

2. **Notification.php** - Eloquent model with:

   - Database relationships
   - Query scopes for filtering
   - JSON metadata support

3. **Database Migration** - SQL file ready to run

## 📋 Implementation Checklist

### Step 1: Database Setup

```bash
# Run the migration SQL file
mysql -u your_username -p your_database < backend/database/migrations/create_notifications_table.sql
```

Or manually execute in phpMyAdmin/MySQL Workbench.

### Step 2: Backend Routes

Add these routes to your `backend/public/api.php`:

```php
// Notification routes (authenticated users only)
$app->group('/notifications', function ($group) {
    $group->get('', [NotificationController::class, 'getNotifications']);
    $group->put('/read-all', [NotificationController::class, 'markAllAsRead']);
    $group->put('/{id}/read', [NotificationController::class, 'markAsRead']);
    $group->delete('/{id}', [NotificationController::class, 'deleteNotification']);
    $group->delete('', [NotificationController::class, 'deleteAll']);
})->add($authMiddleware);
```

### Step 3: Add Notification Triggers

Add notification creation in relevant controllers:

#### Example: FormController - New Submission

```php
// In FormController::submitForm(), after successful submission:
use App\Controllers\NotificationController;

NotificationController::createNotification(
    $form->user_id,
    'form_submission',
    'New Form Submission',
    "Form '{$form->title}' received a new submission",
    [
        'form_id' => $form->id,
        'submission_id' => $formSubmission->id
    ]
);
```

#### Example: EmbedController - Spam Detection

```php
// In EmbedController::submitForm(), when spam detected:
NotificationController::createNotification(
    $form->user_id,
    'spam_detected',
    'Spam Submission Blocked',
    "A spam submission was blocked on form '{$form->title}'",
    [
        'form_id' => $form->id,
        'reason' => $spamCheckResult['reason']
    ]
);
```

#### Example: GoogleSheetsService - Connection Issues

```php
// When sheet authentication fails:
NotificationController::createNotification(
    $userId,
    'sheet_connection',
    'Sheet Connection Error',
    'Your Google Sheet connection needs to be refreshed',
    [
        'sheet_id' => $sheetId,
        'error' => $errorMessage
    ]
);
```

### Step 4: Frontend Redux Store Integration

Update `frontend/src/store/index.js`:

```javascript
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sheets: sheetsReducer,
    forms: formsReducer,
    notifications: notificationsReducer, // Add this line
  },
});
```

### Step 5: Update Header Component

Replace the notification button in `Header.jsx`:

```javascript
import NotificationDropdown from "../Notifications/NotificationDropdown";

// Replace the existing notification button with:
<NotificationDropdown />;
```

### Step 6: Fetch Notifications on App Load

In your main App component or Layout component:

```javascript
import { useDispatch } from "react-redux";
import { fetchNotifications } from "./store/slices/notificationsSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch notifications when user is authenticated
    dispatch(fetchNotifications());

    // Optional: Set up polling for real-time updates
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 60000); // Every 60 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  // ... rest of your App component
}
```

## 🔔 Notification Types and Use Cases

### 1. Form Submission (`form_submission`)

**When to trigger:** Every time a form receives a new submission
**Metadata:**

- `form_id`: ID of the form
- `submission_id`: ID of the submission
  **Action:** Navigate to form submissions page

### 2. Sheet Connection (`sheet_connection`)

**When to trigger:**

- Authentication refreshed successfully
- Authentication failed
- Sheet permissions changed
  **Metadata:**
- `sheet_id`: ID of connected sheet
- `status`: 'success' or 'error'
- `error`: Error message if failed
  **Action:** Navigate to sheets page

### 3. Form Status (`form_status`)

**When to trigger:**

- Form activated/deactivated
- Form deleted
  **Metadata:**
- `form_id`: ID of the form
- `action`: 'activated', 'deactivated', 'deleted'
  **Action:** Navigate to forms page

### 4. API Limit Warning (`api_limit`)

**When to trigger:**

- User reaches 80% of API limit
- User reaches 100% of API limit
  **Metadata:**
- `usage_percentage`: Current usage percentage
- `limit`: Total allowed requests
  **Action:** Navigate to settings or upgrade page

### 5. Spam Detection (`spam_detected`)

**When to trigger:**

- Spam submission blocked
- Multiple spam attempts detected
  **Metadata:**
- `form_id`: ID of the form
- `spam_count`: Number of spam submissions blocked
- `reason`: Reason for spam detection
  **Action:** Navigate to form submissions

### 6. System Announcements (`system`)

**When to trigger:**

- New features released
- Maintenance scheduled
- Important updates
  **Metadata:**
- `announcement_type`: 'feature', 'maintenance', 'update'
- `link`: External link if applicable
  **Action:** Custom based on announcement

## 🚀 Advanced Features (Optional)

### Real-Time Notifications with WebSocket

For instant notifications without polling:

1. Install Socket.IO or Pusher
2. Create WebSocket server
3. Emit events when notifications are created
4. Listen in frontend and dispatch `addNotification` action

### Push Notifications

For browser notifications:

```javascript
// Request permission
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    // Send push notification
    new Notification("New Form Submission", {
      body: "Contact Form received a new submission",
      icon: "/logo.png",
    });
  }
});
```

### Email Notifications

Integrate with email service to send notification emails:

- Immediate: Critical notifications
- Daily digest: Summary of all notifications
- Weekly digest: Low-priority updates

### Notification Preferences

Let users customize which notifications they receive:

- Create `user_notification_preferences` table
- Add settings page for notification preferences
- Check preferences before creating notifications

## 📊 Analytics and Monitoring

Track notification effectiveness:

- Click-through rate on notifications
- Time to acknowledge notifications
- Most common notification types
- User engagement with notifications

## 🧪 Testing

### Test Notification Creation

```php
// Create test notification via PHP
NotificationController::createNotification(
    1, // user_id
    'form_submission',
    'Test Notification',
    'This is a test notification',
    ['test' => true]
);
```

### Test Frontend

1. Log in to the application
2. Check notification bell shows count
3. Click bell to see dropdown
4. Click notification to navigate
5. Mark as read and verify count updates
6. Clear all notifications

## 🔧 Troubleshooting

**Notifications not appearing:**

1. Check database table exists
2. Verify routes are registered
3. Check Redux store is connected
4. Verify API calls are successful
5. Check user_id matches authenticated user

**Count not updating:**

1. Check unread count calculation in backend
2. Verify Redux state is updating
3. Check mark as read API is working

**Navigation not working:**

1. Verify metadata contains correct IDs
2. Check route paths match your routing setup
3. Verify user has permission to access linked pages

## 📝 Summary

You now have a complete notification system ready to implement! The main steps are:

1. ✅ Run database migration
2. ✅ Add routes to backend
3. ✅ Add notification triggers in controllers
4. ✅ Connect Redux store in frontend
5. ✅ Replace notification button in Header
6. ✅ Test thoroughly

The system is designed to be extensible - you can easily add new notification types as your application grows!
