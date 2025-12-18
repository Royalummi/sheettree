# Quick Start Guide - Notifications System

## 🚀 Start Testing in 3 Steps

### Step 1: Verify Database

The notifications table has been created with 8-10 sample notifications. You can verify in phpMyAdmin:

- Navigate to: http://localhost/phpmyadmin
- Database: `sheettree_db`
- Table: `notifications`
- You should see 8 notifications for user_id 1 and 2 for user_id 2

### Step 2: Start the Application

```bash
# Backend is already running (Apache/MySQL via XAMPP)

# Start Frontend
cd C:\xampp\htdocs\sheetTree\frontend
npm run dev
```

### Step 3: Test Notifications

1. **Open your browser**: http://localhost:5173
2. **Login** with your Google account (user_id 1 or 2)
3. **Click the bell icon** in the header (top-right) - You'll see the notification dropdown
4. **Click "View All"** - Navigate to the full notifications page

## 🎯 Features to Test

### Notification Dropdown (Header Bell Icon)

- [ ] Bell icon shows unread count badge (e.g., "3")
- [ ] Click bell to open dropdown
- [ ] See last 5 notifications with icons and timestamps
- [ ] Click "Mark all read" - unread count should become 0
- [ ] Click "View All" - navigate to /notifications page
- [ ] Click a notification - it marks as read and navigates to related page

### Notifications Page (/notifications)

#### Stats Cards

- [ ] Total notifications count is correct
- [ ] Unread count matches (orange number)
- [ ] Today's count shows notifications from today
- [ ] This week's count shows last 7 days

#### Search

- [ ] Type "form" in search box - filters notifications by title/message
- [ ] Type "spam" - shows only spam-related notifications
- [ ] Clear search - shows all notifications again

#### Filters

- [ ] Type dropdown: Select "Form Submission" - shows only form submission notifications
- [ ] Type dropdown: Select "Spam Detected" - shows only spam notifications
- [ ] Status dropdown: Select "Unread" - shows only unread (blue highlighted rows)
- [ ] Status dropdown: Select "Read" - shows only read notifications
- [ ] Reset filters to "All Types" and "All" - shows everything

#### Bulk Actions

- [ ] Check the header checkbox - selects all notifications on current page
- [ ] Check individual notification checkboxes - selection count shows
- [ ] Blue action bar appears with selection count
- [ ] Click "Mark as Read" - selected notifications become read
- [ ] Click "Delete" - selected notifications are removed
- [ ] Click "Cancel" - deselects all

#### Row Actions

- [ ] Click three-dot menu on any notification
- [ ] For unread: "Mark as Read" option appears
- [ ] Click "Mark as Read" - notification becomes read (badge changes)
- [ ] Click "View Details" - navigates to related form/sheet
- [ ] Click "Delete" - notification is removed

#### Pagination

- [ ] Shows "1-10 of X notifications" at bottom
- [ ] Click "Next" - goes to page 2
- [ ] Click "Previous" - goes back to page 1
- [ ] Click page numbers - jumps to that page
- [ ] Pagination maintains filters

#### Navigation

- [ ] Click on any notification row - marks as read and navigates
- [ ] Form submission notification → goes to /forms/{id}/edit
- [ ] Sheet connection notification → goes to /sheets
- [ ] Back button returns to notifications

#### Visual States

- [ ] Unread notifications have blue background
- [ ] Read notifications have white background
- [ ] Unread badge is blue, read badge is gray
- [ ] Icons are color-coded by type (green=form, red=spam, etc.)
- [ ] Hover states on rows and buttons work
- [ ] Loading skeleton appears on first load

#### Empty States

- [ ] Search for "xyz123notfound" - shows "No notifications found"
- [ ] Mark all as read and filter by "Unread" - shows empty state

## 🐛 Common Issues & Fixes

### Issue: Notifications page shows blank/white screen

**Fix**:

1. Open browser console (F12)
2. Check for errors
3. Likely cause: Redux store not loaded
4. Solution: Refresh page or check if backend is running

### Issue: Bell icon doesn't show unread count

**Fix**:

1. Check if Redux store has notifications
2. Open Redux DevTools
3. Look for `notifications.unreadCount`
4. If 0, mark some notifications as unread in database

### Issue: "Network Error" when clicking buttons

**Fix**:

1. Check if Apache is running (XAMPP control panel)
2. Check if backend API is accessible: http://localhost/notifications
3. Check browser console for CORS errors
4. Verify authentication token is present

### Issue: Pagination doesn't work

**Fix**:

1. Need more than 10 notifications to see pagination
2. Insert more test data or set `itemsPerPage` to lower number
3. Edit `frontend/src/pages/Notifications/Notifications.jsx` line 52

### Issue: shadcn/ui components not styled

**Fix**:

1. Check if Tailwind CSS is working
2. Verify `frontend/src/index.css` has shadcn imports
3. Run `npm run dev` to rebuild if needed

## 📸 What You Should See

### Notification Dropdown

```
🔔 (3)  ← Badge with count
├── ✓ New Form Submission    5m ago
├── ⓘ Sheet Connection       1h ago
└── ✕ Spam Detected          2h ago
    ├── [Mark all read]
    ├── [Clear all]
    └── View All →
```

### Notifications Page

```
┌─────────────────────────────────────┐
│ Notifications                        │
│ Manage and view all your activity   │
└─────────────────────────────────────┘

┌─────┬─────┬─────┬─────┐
│  42 │  3  │  5  │  12 │
│Total│Unread│Today│Week │
└─────┴─────┴─────┴─────┘

┌──────────────────────────────────┐
│ [🔍 Search] [Type▼] [Status▼]   │
│ [✓ Mark All Read] [⋮ More]      │
└──────────────────────────────────┘

┌───────────────────────────────────────┐
│ [☐] Notification  Type  Date  Status │
├───────────────────────────────────────┤
│ [☐] ✓ New Form... Form  5m   Unread │
│ [☐] ⓘ Sheet...    Sheet 1h   Read   │
│ [☐] ✕ Spam Blo... Spam  2h   Unread │
└───────────────────────────────────────┘

[◄ Previous] [1] [2] [3] [Next ►]
```

## ✅ Success Indicators

You'll know the system is working when:

1. ✅ Bell icon shows a number (e.g., "3")
2. ✅ Clicking bell opens dropdown with notifications
3. ✅ /notifications page loads without errors
4. ✅ Stats cards show correct numbers
5. ✅ Search filters notifications in real-time
6. ✅ Clicking "Mark as Read" changes badge from blue to gray
7. ✅ Clicking notification navigates to form/sheet page
8. ✅ Pagination shows page numbers
9. ✅ Redux DevTools shows notifications state
10. ✅ No console errors in browser

## 🎉 You're Done!

If all tests pass, your notification system is fully functional and production-ready!

For advanced features like real-time updates with WebSocket or automatic notification creation on form submissions, refer to `NOTIFICATIONS_IMPLEMENTATION.md` in the backend folder.

## 📞 Need Help?

Check these files for implementation details:

- Backend: `backend/src/Controllers/NotificationController.php`
- Frontend Page: `frontend/src/pages/Notifications/Notifications.jsx`
- Frontend Dropdown: `frontend/src/components/Notifications/NotificationDropdown.jsx`
- Redux Store: `frontend/src/store/slices/notificationsSlice.js`
- Database: `backend/database/migrations/create_notifications_table.sql`

Happy testing! 🚀
