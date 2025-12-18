# SheetTree Iframe Embeddable Forms - Implementation Guide

## 🎯 Overview

The iframe embeddable forms system allows users to embed SheetTree forms directly into their websites using simple iframe code. This complements the External API system to provide a complete dual integration strategy.

## 🏗️ Architecture

### Shared Foundation

Both External API and Embeddable Forms use the same backend infrastructure:

```
┌─────────────────────────────────────────────────────────────┐
│                    Form Configuration                        │
│           (Forms, FormApiConfig, ConnectedSheet)             │
├─────────────────────────────────────────────────────────────┤
│          │                              │                   │
│          ▼                              ▼                   │
│  ┌───────────────┐              ┌───────────────┐          │
│  │ Embed Route   │              │ API Route     │          │
│  │ /embed/form/  │              │ /api/external/│          │
│  │               │              │               │          │
│  │ Returns HTML  │              │ Returns JSON  │          │
│  │ with styling  │              │ with data     │          │
│  └───────────────┘              └───────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── EmbedController.php          # New iframe controller
│   │   └── ExternalApiController.php    # Existing API controller
│   ├── routes/
│   │   ├── EmbedRoutes.php             # New iframe routes
│   │   └── ExternalApiRoutes.php       # Existing API routes
│   ├── models/
│   │   ├── Form.php                    # Updated with apiConfigs() relation
│   │   ├── FormApiConfig.php           # Shared configuration
│   │   └── ApiSubmission.php           # Shared submissions
│   └── services/
│       ├── GoogleSheetsService.php     # Shared Google Sheets integration
│       ├── CaptchaService.php          # Shared CAPTCHA validation
│       └── SpamProtectionService.php   # Shared spam protection
└── public/
    ├── iframe-demo.html                # Demo page for testing
    └── index.php                       # Updated with embed routes
```

## 🔗 API Endpoints

### 1. Display Embeddable Form

```
GET /embed/form/{formId}
```

**Purpose:** Returns HTML page with the embeddable form
**Response:** HTML content ready for iframe embedding
**Security:** No authentication required (public endpoint)

### 2. Submit Form Data

```
POST /embed/form/{formId}/submit
```

**Purpose:** Handle form submissions from embedded forms
**Request:** JSON data from the form
**Response:** JSON success/error response
**Security:** Same validation as External API (CAPTCHA, spam protection, etc.)

### 3. CORS Preflight

```
OPTIONS /embed/form/{formId}/submit
```

**Purpose:** Handle CORS preflight requests for cross-origin submissions
**Response:** CORS headers for allowed origins

## 🎨 Features Implemented

### 1. Form Rendering

- ✅ Dynamic HTML generation based on form configuration
- ✅ Responsive design for mobile devices
- ✅ Customizable themes and styling
- ✅ Field types: text, email, textarea, select
- ✅ Required field validation
- ✅ Placeholder text support

### 2. Security Features (Same as External API)

- ✅ **CAPTCHA Integration:** reCAPTCHA v2/v3, hCaptcha
- ✅ **Spam Protection:** Honeypot fields, pattern detection
- ✅ **Field Validation:** Required fields, data type validation
- ✅ **CORS Protection:** Configurable allowed origins
- ✅ **Rate Limiting:** Built into spam protection service

### 3. Google Sheets Integration

- ✅ **Same Backend:** Uses existing GoogleSheetsService
- ✅ **User Authentication:** Authenticates with form owner's OAuth tokens
- ✅ **Data Writing:** Appends submissions to connected sheets
- ✅ **Error Handling:** Graceful handling of sheet access issues

### 4. Auto-Resize Functionality

- ✅ **PostMessage API:** Communicates iframe height to parent window
- ✅ **Dynamic Resizing:** Adjusts based on content changes
- ✅ **Cross-Browser Support:** Works across modern browsers

### 5. User Experience

- ✅ **Loading States:** Button states during submission
- ✅ **Success/Error Messages:** Clear feedback to users
- ✅ **Form Reset:** Clears form after successful submission
- ✅ **Mobile Responsive:** Optimized for all screen sizes

## 🔧 Usage Examples

### Basic Embedding

```html
<iframe
  src="https://yourdomain.com/embed/form/123"
  width="100%"
  height="600"
  frameborder="0"
  title="Contact Form"
>
</iframe>
```

### With Auto-Resize

```html
<iframe
  id="contactForm"
  src="https://yourdomain.com/embed/form/123"
  width="100%"
  frameborder="0"
  title="Contact Form"
>
</iframe>

<script>
  window.addEventListener("message", function (event) {
    if (event.data.type === "sheetTreeFormResize") {
      document.getElementById("contactForm").style.height =
        event.data.height + "px";
    }

    if (event.data.type === "sheetTreeFormSuccess") {
      console.log("Form submitted:", event.data.message);
      // Handle success (show thank you message, redirect, etc.)
    }
  });
</script>
```

### Advanced Integration

```html
<div id="form-container">
  <iframe
    id="sheetTreeForm"
    src="https://yourdomain.com/embed/form/123"
    width="100%"
    frameborder="0"
  >
  </iframe>
  <div id="thank-you" style="display: none;">
    <h3>Thank you for your submission!</h3>
    <p>We'll get back to you soon.</p>
  </div>
</div>

<script>
  window.addEventListener("message", function (event) {
    const iframe = document.getElementById("sheetTreeForm");
    const thankYou = document.getElementById("thank-you");

    if (event.data.type === "sheetTreeFormResize") {
      iframe.style.height = event.data.height + "px";
    }

    if (event.data.type === "sheetTreeFormSuccess") {
      // Hide form and show thank you message
      iframe.style.display = "none";
      thankYou.style.display = "block";

      // Optional: Track conversion
      gtag("event", "form_submit", {
        form_id: event.data.formId,
        form_name: "Contact Form",
      });
    }
  });
</script>
```

## 🎨 Theme Customization

### Default Theme Structure

```php
$defaultTheme = [
    'primary_color' => '#007cba',
    'background_color' => '#ffffff',
    'text_color' => '#333333',
    'border_color' => '#dddddd',
    'border_radius' => '4px',
    'font_family' => 'Arial, sans-serif',
    'form_width' => '100%',
    'field_spacing' => '20px'
];
```

### Custom Theme Configuration

Themes can be customized by setting the `custom_response_data.theme` field in FormApiConfig:

```php
$apiConfig->update([
    'custom_response_data' => [
        'theme' => [
            'primary_color' => '#ff6b6b',
            'background_color' => '#f8f9fa',
            'text_color' => '#2c3e50',
            'border_radius' => '8px',
            'font_family' => 'Roboto, sans-serif'
        ]
    ]
]);
```

## 🔄 Message Events

The iframe communicates with the parent window using PostMessage API:

### Resize Event

```javascript
{
    type: 'sheetTreeFormResize',
    formId: 123,
    height: 650  // New height in pixels
}
```

### Success Event

```javascript
{
    type: 'sheetTreeFormSuccess',
    formId: 123,
    message: 'Form submitted successfully!'
}
```

## 🧪 Testing

### Demo Page

- **URL:** `http://localhost:8000/iframe-demo.html`
- **Purpose:** Comprehensive demonstration of iframe functionality
- **Features:** Live embed, code examples, feature showcase

### Manual Testing Checklist

- [ ] Form loads in iframe without errors
- [ ] All field types render correctly
- [ ] Form validation works (required fields, etc.)
- [ ] CAPTCHA displays and validates (if enabled)
- [ ] Spam protection blocks honeypot submissions
- [ ] Successful submissions write to Google Sheets
- [ ] Auto-resize functionality works
- [ ] Mobile responsiveness
- [ ] CORS headers work for cross-origin embedding
- [ ] Success/error messages display correctly

## 🚀 Deployment Considerations

### Production Setup

1. **HTTPS Required:** Ensure all iframe sources use HTTPS in production
2. **CSP Headers:** Configure Content Security Policy for iframe embedding
3. **CORS Configuration:** Set appropriate allowed origins for security
4. **Rate Limiting:** Monitor and adjust rate limits for embedded forms
5. **Error Monitoring:** Set up logging for iframe-specific errors

### Performance Optimization

- **Minified CSS/JS:** Minimize payload size for faster loading
- **CDN Assets:** Use CDN for external resources (fonts, CAPTCHA, etc.)
- **Caching Headers:** Set appropriate cache headers for static assets
- **Lazy Loading:** Consider lazy loading for non-critical iframe content

## 🔮 Future Enhancements

### Phase 3: Visual Builder (Planned)

- Drag & drop form builder
- Advanced theme editor with live preview
- Pre-built templates
- Custom CSS injection

### Phase 4: Advanced Features (Planned)

- A/B testing for embedded forms
- Advanced analytics and heatmaps
- Team collaboration features
- White-label options for agencies

## 📊 Success Metrics

### Technical Metrics

- **Load Time:** < 2 seconds for form rendering
- **Error Rate:** < 1% for form submissions
- **Mobile Usage:** Support for all devices
- **Browser Compatibility:** 99%+ success rate

### Business Metrics

- **Adoption Rate:** % of users choosing embed vs API
- **Conversion Rate:** Form completion rates
- **User Satisfaction:** Support ticket volume
- **Integration Success:** Successful embedding rate

## 🤝 Comparison: Embeddable Forms vs External API

| Feature               | Embeddable Forms            | External API        |
| --------------------- | --------------------------- | ------------------- |
| **Target Users**      | Non-technical users         | Developers          |
| **Setup Difficulty**  | ⭐ Very Easy                | ⭐⭐⭐ Medium       |
| **Customization**     | ⭐⭐⭐ High (Themes)        | ⭐⭐⭐⭐⭐ Complete |
| **Technical Skills**  | ❌ Not Required             | ✅ Required         |
| **Mobile Responsive** | ✅ Automatic                | ⚡ Your Choice      |
| **Security**          | ✅ Built-in                 | ✅ Configurable     |
| **Google Sheets**     | ✅ Automatic                | ✅ Automatic        |
| **Analytics**         | ✅ Built-in                 | ✅ API Access       |
| **Branding**          | ⚡ SheetTree (configurable) | ✅ Your Brand       |

Both approaches use the **same backend infrastructure**, ensuring consistent functionality and data flow regardless of integration method chosen.
