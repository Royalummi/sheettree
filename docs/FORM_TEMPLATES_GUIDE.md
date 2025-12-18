# Form Templates Feature - Implementation Guide

## 📋 **Overview**

The form templates feature allows users to quickly create forms by selecting from 10 pre-built templates or starting from scratch. Templates cover common use cases like contact forms, event registration, surveys, and more.

---

## 🗄️ **Database Structure**

### Table: `form_templates`

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR 255) - Template name
- description (TEXT) - Template description
- category (VARCHAR 50) - Category (contact, event, survey, etc.)
- icon (VARCHAR 50) - Emoji icon
- fields (JSON) - Array of field configurations
- settings (JSON) - Default form settings
- is_active (BOOLEAN) - Active status
- usage_count (INT) - Track popularity
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Indexes:**

- idx_category (category)
- idx_active (is_active)
- idx_usage (usage_count)

---

## 🎨 **Pre-Built Templates**

1. **Simple Contact Form** (📧 contact)

   - Name, Email, Phone, Message

2. **Event Registration** (📅 event)

   - Name, Email, Phone, Company, Attendees, Special Requirements

3. **Customer Feedback Survey** (📊 survey)

   - Name, Email, Satisfaction Rating, NPS Score, Feedback

4. **Job Application** (💼 application)

   - Name, Email, Phone, LinkedIn, Position, Experience, Cover Letter, Resume

5. **Product Order Form** (🛒 order)

   - Name, Email, Phone, Product, Quantity, Address, Instructions

6. **Newsletter Signup** (📬 general)

   - First Name, Last Name, Email, Frequency

7. **Support Ticket** (🎫 business)

   - Name, Email, Priority, Category, Subject, Description

8. **Course Registration** (🎓 registration)

   - Name, Email, Phone, Course, Schedule, Education, Goals

9. **Appointment Booking** (📆 business)

   - Name, Email, Phone, Date, Time, Service Type, Notes

10. **Blank Template** (✨ general)
    - Single text field (fully customizable)

---

## 🔌 **Backend API**

### Endpoints

#### 1. GET `/templates`

Get all active templates

**Query Parameters:**

- `category` (optional) - Filter by category

**Response:**

```json
{
  "templates": [
    {
      "id": 1,
      "name": "Simple Contact Form",
      "description": "Basic contact form...",
      "category": "contact",
      "icon": "📧",
      "fields": [...],
      "settings": {...},
      "usage_count": 15
    }
  ]
}
```

#### 2. GET `/templates/{id}`

Get single template by ID

**Response:**

```json
{
  "template": {
    "id": 1,
    "name": "Simple Contact Form",
    ...
  }
}
```

#### 3. POST `/templates/{id}/use`

Record template usage (increments usage_count)

**Headers:** `Authorization: Bearer {token}`

**Response:**

```json
{
  "message": "Template usage recorded",
  "usage_count": 16
}
```

#### 4. GET `/templates/categories`

Get all template categories

**Response:**

```json
{
  "categories": [
    {"value": "contact", "label": "Contact Forms", "icon": "📧"},
    {"value": "event", "label": "Event Registration", "icon": "📅"},
    ...
  ]
}
```

---

## 🎯 **Frontend Components**

### TemplateSelector Component

**Location:** `frontend/src/components/Forms/TemplateSelector.jsx`

**Props:**

- `isOpen` (boolean) - Modal visibility
- `onClose` (function) - Close handler
- `onSelectTemplate` (function) - Template selection handler

**Features:**

- Search templates by name/description
- Filter by category
- Displays usage count
- Beautiful card-based grid layout
- Responsive design
- Loading states

**Usage:**

```jsx
import TemplateSelector from "../../components/Forms/TemplateSelector";

<TemplateSelector
  isOpen={showTemplateSelector}
  onClose={handleSkipTemplate}
  onSelectTemplate={handleTemplateSelect}
/>;
```

### CreateForm Integration

**Location:** `frontend/src/pages/Forms/CreateForm.jsx`

**Key Changes:**

1. Added `showTemplateSelector` state (defaults to true)
2. Added `LayoutGrid` icon import
3. Added `TemplateSelector` import
4. Added "Browse Templates" button in header
5. Added `handleTemplateSelect` function to load template data
6. Template selector shows automatically on page load

---

## 🚀 **User Flow**

1. **User clicks "Create New Form"**
   - Template selector modal opens automatically
2. **User browses templates**

   - Search by keyword
   - Filter by category (All, Contact, Event, Survey, etc.)
   - View template details (name, description, field count)
   - See popularity (usage count)

3. **User selects a template**

   - Template data loads into form
   - Fields are pre-populated
   - Title and description filled
   - Success toast notification
   - Modal closes

4. **User customizes the form**

   - Edit/add/remove fields
   - Modify settings
   - Connect to Google Sheet
   - Save form

5. **Alternative: Skip templates**

   - Click "Cancel" or X button
   - Start with blank form

6. **Re-open templates**
   - Click "Browse Templates" button in header anytime

---

## 📊 **Field Structure**

Templates store fields as JSON arrays:

```json
{
  "id": 1,
  "type": "text",
  "label": "Full Name",
  "required": true,
  "placeholder": "Enter your name",
  "options": [] // For select/radio/checkbox types
}
```

**Supported Field Types:**

- text
- email
- tel
- date
- number
- textarea
- select
- radio
- checkbox

---

## 🔧 **Files Created/Modified**

### Backend

- ✅ `database/migrations/create_form_templates_table.sql`
- ✅ `database/seeds/form_templates_seed.sql`
- ✅ `src/Models/FormTemplate.php`
- ✅ `src/Controllers/FormTemplateController.php`
- ✅ `src/Routes/FormTemplateRoutes.php`
- ✅ `public/index.php` (added route registration)

### Frontend

- ✅ `src/components/Forms/TemplateSelector.jsx`
- ✅ `src/pages/Forms/CreateForm.jsx` (modified)

---

## 🧪 **Testing**

### Backend Tests

```bash
# Verify PHP syntax
php -l src/Controllers/FormTemplateController.php
php -l src/Models/FormTemplate.php
php -l src/Routes/FormTemplateRoutes.php

# Check database
mysql -u root sheettree_db -e "SELECT COUNT(*) FROM form_templates;"

# Test API endpoints
curl http://localhost:8000/api.php?path=templates
curl http://localhost:8000/api.php?path=templates/categories
curl http://localhost:8000/api.php?path=templates/1
```

### Frontend Tests

1. Navigate to "Create New Form"
2. Verify template selector opens automatically
3. Test search functionality
4. Test category filters
5. Select a template and verify data loads
6. Test "Browse Templates" button
7. Verify "Cancel" closes modal

---

## 📈 **Future Enhancements**

- [ ] User-created custom templates (save form as template)
- [ ] Template preview mode
- [ ] Template ratings/reviews
- [ ] Admin panel for managing templates
- [ ] Template versioning
- [ ] Template sharing between users
- [ ] Import/export templates
- [ ] Template categories management
- [ ] Multi-language template support
- [ ] Template analytics dashboard

---

## 🐛 **Troubleshooting**

### Templates not loading

- Check database: `SELECT * FROM form_templates;`
- Verify backend API: `curl http://localhost:8000/api.php?path=templates`
- Check browser console for errors

### Modal not appearing

- Check `showTemplateSelector` state in CreateForm.jsx
- Verify TemplateSelector import
- Check console for component errors

### Template data not loading into form

- Verify `handleTemplateSelect` function
- Check field structure matches expected format
- Ensure unique IDs are generated for fields

---

## 📝 **Notes**

- Templates are **system-wide** (same for all users)
- Templates are **public** (no authentication required to view)
- Usage tracking requires authentication
- Template selector shows on create form page load by default
- Users can skip templates and start from scratch
- Field IDs are regenerated when template is applied to avoid conflicts

---

**Status:** ✅ **Fully Implemented & Production Ready**

**Version:** 1.0.0  
**Last Updated:** December 14, 2025
