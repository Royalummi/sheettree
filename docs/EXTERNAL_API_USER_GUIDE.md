# External API System - Complete User Guide

## 🎯 Overview

The External API system transforms your existing **SheetTree Forms** into public APIs that external applications can submit data to. This means you first need to create a form in SheetTree, then convert it into an External API endpoint.

## 📋 Prerequisites - Why "Select Form" is Required

### The Foundation: Forms → APIs

1. **You must have a Form first** - External APIs are built on top of existing SheetTree forms
2. **Forms define the data structure** - The form fields determine what data the API will accept
3. **Forms are connected to Google Sheets** - The API will write data to the same sheet as the form

### Complete Flow Chain:

```
Google Sheet → SheetTree Form → External API → Third-party Applications
```

## 🚀 Complete Step-by-Step Flow

### Phase 1: Prerequisites Setup

#### Step 1: Create a Google Sheet

1. Go to Google Sheets
2. Create a new spreadsheet
3. Add column headers (e.g., "Name", "Email", "Message")
4. Note the spreadsheet ID from the URL

#### Step 2: Connect Sheet to SheetTree

1. In SheetTree, go to "Sheets" section
2. Click "Connect New Sheet"
3. Select your Google Sheet
4. Configure the sheet connection

#### Step 3: Create a Form

1. Go to "Forms" section in SheetTree
2. Click "Create New Form"
3. Select your connected sheet
4. Configure form fields that match your sheet columns
5. Set up validation rules
6. Save the form

### Phase 2: Creating External API

#### Step 4: Create External API

1. Go to "External APIs" section
2. Click "Create API"
3. **Select Form** - Choose from your existing forms
4. Configure API settings (detailed below)

## 🔧 External API Creation Wizard - All Options Explained

### Step 1: Basic Information

#### **API Name**

- **What it is**: A human-readable name for your API
- **Example**: "Website Contact Form API"
- **Purpose**: Helps you identify the API in your dashboard

#### **API Description**

- **What it is**: Optional description of the API's purpose
- **Example**: "Collects contact form submissions from our website"
- **Purpose**: Documentation and team understanding

#### **Select Form** ⭐ (This is why you see this option!)

- **What it is**: The SheetTree form this API will be based on
- **Why required**:
  - Defines what data fields the API will accept
  - Determines which Google Sheet the data goes to
  - Inherits validation rules from the form
- **Example**: If your form has "Name", "Email", "Message" fields, the API will accept those same fields

#### **Sheet Range**

- **What it is**: Which columns in your Google Sheet to write to
- **Example**: "A:C" (columns A through C)
- **Purpose**: Controls exactly where API data is written
- **Default**: Usually matches your form's column mapping

### Step 2: Security Settings

#### **Rate Limiting**

- **Per Minute**: How many requests allowed per minute per IP
- **Per Hour**: How many requests allowed per hour per IP
- **Per Day**: How many requests allowed per day per IP
- **Purpose**: Prevents abuse and spam
- **Example**: 10/minute, 100/hour, 1000/day

#### **CORS (Cross-Origin Resource Sharing)**

- **What it is**: Controls which websites can call your API
- **Enabled**: Allows web browsers to call your API
- **Allowed Origins**: List of allowed domains
- **Example**: ["https://mywebsite.com", "https://app.mywebsite.com"]
- **Purpose**: Security control for web applications

#### **API Key Authentication**

- **What it is**: Requires a secret key to access the API
- **When to use**: For sensitive APIs or private integrations
- **When to skip**: For public contact forms
- **Purpose**: Additional security layer

### Step 3: Validation Rules

#### **Field Validation**

- **What it is**: Rules that submitted data must follow
- **Inherited from Form**: Uses your form's validation rules
- **Customizable**: You can add API-specific rules
- **Examples**:
  - Name: Required, minimum 2 characters
  - Email: Required, valid email format
  - Message: Required, minimum 10 characters

#### **Required Fields**

- **What it is**: Fields that must be included in API submissions
- **Purpose**: Ensures data quality and completeness
- **Example**: ["name", "email"] - both must be provided

### Step 4: Response Configuration

#### **Success Response**

- **What it is**: Message sent back when submission succeeds
- **Default**: "Data submitted successfully"
- **Customizable**: You can personalize the message
- **Example**: "Thank you! We'll contact you within 24 hours."

#### **Error Response**

- **What it is**: Message sent back when submission fails
- **Includes**: Validation errors and failure reasons
- **Example**: "Validation failed: Email is required"

#### **Webhook URL** (Optional)

- **What it is**: URL to notify when new submissions arrive
- **Purpose**: Real-time notifications to your application
- **Example**: "https://myapp.com/webhook"
- **Use case**: Trigger automated responses or processing

## 🌐 How External APIs Work

### API Endpoint Structure

```
POST /api/external/submit/{apiHash}
```

### Example API Usage

```javascript
// External website submits data to your API
fetch("http://localhost:8000/api/external/submit/abc123hash", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: "https://mywebsite.com",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello from my website!",
  }),
});
```

### What Happens When API Receives Data

1. **Validation**: Checks if data meets your validation rules
2. **Rate Limiting**: Ensures the IP hasn't exceeded limits
3. **CORS Check**: Verifies the request comes from allowed origin
4. **Authentication**: Checks API key if required
5. **Google Sheets**: Writes data to your connected sheet
6. **Response**: Sends success/error message back
7. **Webhook**: Notifies your webhook URL if configured
8. **Statistics**: Updates usage statistics and analytics

## 📊 Real-World Use Cases

### Use Case 1: Website Contact Form

1. **Form**: "Contact Us" form with Name, Email, Message
2. **API**: Public API (no auth required)
3. **Settings**: CORS enabled for your website domain
4. **Result**: Website visitors can submit contact forms

### Use Case 2: Mobile App Integration

1. **Form**: "User Feedback" form with Rating, Comments, User ID
2. **API**: Private API (requires API key)
3. **Settings**: No CORS (mobile app doesn't need it)
4. **Result**: Mobile app can submit user feedback

### Use Case 3: Partner Integration

1. **Form**: "Lead Capture" form with Company, Contact, Budget
2. **API**: Private API with webhook
3. **Settings**: Specific partner domains allowed
4. **Result**: Partner websites can submit leads, you get notified

## 🔄 Complete Data Flow Example

### Scenario: Website Contact Form

1. **Setup Phase**:

   - Create Google Sheet with columns: Name, Email, Message, Timestamp
   - Connect sheet to SheetTree
   - Create form with Name, Email, Message fields
   - Create External API based on this form

2. **Configuration**:

   - API Name: "Website Contact API"
   - Form: "Contact Us Form"
   - CORS: Enabled for "https://mywebsite.com"
   - Rate Limiting: 5/minute, 50/hour, 500/day
   - Required Fields: name, email, message

3. **Implementation**:

   - Add JavaScript to your website
   - Form submission calls your API endpoint
   - API validates data and writes to Google Sheet
   - Success message shown to user

4. **Monitoring**:
   - View statistics in SheetTree dashboard
   - Track submission rates and errors
   - Monitor API performance

## 🚨 Common Issues & Solutions

### "Select Form" Dropdown is Empty

**Problem**: No forms available to select
**Solution**:

1. Go to "Forms" section first
2. Create a new form
3. Connect it to a Google Sheet
4. Return to External APIs and try again

### API Returns "Validation Failed"

**Problem**: Submitted data doesn't match form rules
**Solution**:

1. Check your form's validation rules
2. Ensure API submission includes all required fields
3. Verify data types match (string, email, number)

### CORS Errors in Browser

**Problem**: "Access to fetch blocked by CORS policy"
**Solution**:

1. Enable CORS in your API settings
2. Add your website domain to allowed origins
3. Ensure exact domain match (https vs http)

### Rate Limit Exceeded

**Problem**: Too many requests from same IP
**Solution**:

1. Increase rate limits in API settings
2. Implement client-side rate limiting
3. Use different IPs for testing

## 🎨 Frontend Features Explained

### API Dashboard

- **Cards**: Each API shows as a card with key information
- **Status**: Active/Inactive badge
- **Features**: CORS, Validation, Authentication badges
- **Statistics**: Quick submission count display

### Quick Actions

- **Stats**: View detailed analytics and charts
- **Docs**: Auto-generated API documentation
- **Test**: Interactive API testing page
- **Edit**: Modify API settings
- **Regenerate Key**: Create new API key
- **Delete**: Remove API (with confirmation)

### Statistics Dashboard

- **Usage Charts**: Visual representation of API usage
- **Success Rates**: Percentage of successful submissions
- **Response Times**: API performance metrics
- **Error Analysis**: Common failure patterns

## 🔧 Advanced Configuration

### Custom Validation Rules

```javascript
{
  "name": {
    "required": true,
    "type": "string",
    "min_length": 2,
    "max_length": 50,
    "pattern": "^[a-zA-Z\\s]+$"
  },
  "email": {
    "required": true,
    "type": "email"
  },
  "age": {
    "required": false,
    "type": "integer",
    "min": 13,
    "max": 120
  }
}
```

### Webhook Configuration

```javascript
{
  "webhook_url": "https://myapp.com/webhook",
  "webhook_secret": "your-secret-key",
  "events": ["submission.created", "submission.failed"]
}
```

## 📝 Best Practices

### Security

1. **Use HTTPS**: Always use secure connections
2. **Validate Origins**: Restrict CORS to specific domains
3. **Monitor Usage**: Watch for unusual activity patterns
4. **Rotate Keys**: Regularly regenerate API keys
5. **Set Appropriate Limits**: Don't make limits too high

### Performance

1. **Optimize Validation**: Keep validation rules simple
2. **Monitor Response Times**: Track API performance
3. **Use Caching**: Cache frequently accessed data
4. **Archive Old Data**: Remove old submissions periodically

### User Experience

1. **Clear Error Messages**: Provide helpful validation feedback
2. **Consistent Responses**: Use standard response formats
3. **Rate Limit Feedback**: Tell users when they're hitting limits
4. **Documentation**: Keep API docs updated

## 🎯 Summary

The External API system is a powerful bridge between your SheetTree forms and external applications. The key insight is that **APIs are built on top of existing forms** - you can't create an API without first having a form that defines the data structure and Google Sheet destination.

The complete flow is:

1. **Create Google Sheet** (data destination)
2. **Create SheetTree Form** (data structure and validation)
3. **Create External API** (public endpoint)
4. **Integrate with applications** (submit data to API)

This architecture ensures consistency, security, and ease of management while providing powerful external integration capabilities.
