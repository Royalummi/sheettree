# Landing Page Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Quality

- [ ] All components tested and passing
- [ ] No console errors in browser
- [ ] No ESLint warnings
- [ ] Code reviewed and approved
- [ ] Git repository up to date

### ✅ SEO Optimization

- [ ] Meta tags configured in SEOHead.jsx
- [ ] Sitemap.xml created and accessible
- [ ] Robots.txt configured properly
- [ ] Canonical URLs set correctly
- [ ] Structured data (JSON-LD) validated
- [ ] Open Graph tags tested with Facebook Debugger
- [ ] Twitter Card tags tested with Twitter Card Validator
- [ ] Google Search Console setup completed

### ✅ Performance

- [ ] Lighthouse performance score > 90
- [ ] Images optimized (WebP format)
- [ ] Bundle size < 200KB (gzipped)
- [ ] Lazy loading implemented for images
- [ ] Code splitting enabled
- [ ] CSS purged (unused styles removed)
- [ ] Critical CSS inlined

### ✅ Content Review

- [ ] All copy proofread and approved
- [ ] CTAs clear and compelling
- [ ] Pricing accurate and up-to-date
- [ ] Contact information correct
- [ ] Legal links functional (Privacy, Terms)
- [ ] Brand consistency maintained

### ✅ Functionality Testing

- [ ] All internal links working
- [ ] All external links open in new tab
- [ ] Forms submitting correctly
- [ ] Navigation smooth and intuitive
- [ ] Scroll animations triggering properly
- [ ] Mobile menu functioning
- [ ] Browser back/forward working

### ✅ Responsive Design

- [ ] Mobile (320px - 767px) tested
- [ ] Tablet (768px - 1023px) tested
- [ ] Desktop (1024px+) tested
- [ ] Large screens (1920px+) tested
- [ ] Touch interactions work on mobile
- [ ] No horizontal scrolling issues

### ✅ Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### ✅ Accessibility (WCAG 2.1 AA)

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text for all images
- [ ] ARIA labels where needed
- [ ] Color contrast ratios meet standards
- [ ] Screen reader tested
- [ ] No keyboard traps

### ✅ Security

- [ ] HTTPS enabled (SSL certificate)
- [ ] Security headers configured
- [ ] No exposed API keys
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Content Security Policy set

### ✅ Analytics & Monitoring

- [ ] Google Analytics installed
- [ ] Google Tag Manager configured
- [ ] Conversion tracking setup
- [ ] Error monitoring enabled (Sentry/LogRocket)
- [ ] Heatmap tracking (Hotjar/Clarity)
- [ ] A/B testing ready (if needed)

## Deployment Steps

### 1. Build Production Bundle

```bash
cd frontend
npm run build
```

### 2. Test Production Build Locally

```bash
npm run preview
```

Visit http://localhost:4173 and test thoroughly

### 3. Upload to Hostinger

- Navigate to hPanel File Manager
- Go to public_html/sheets.gopafy.com
- Upload all files from `dist/` folder
- Ensure `.htaccess` is configured for SPA routing

### 4. Configure .htaccess

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 5. SSL Certificate

- Go to hPanel → SSL/TLS
- Enable "Force HTTPS Redirect"
- Verify SSL certificate is active

### 6. DNS Configuration

- Verify A record points to Hostinger IP
- Check CNAME for www subdomain
- Wait for DNS propagation (up to 48 hours)

### 7. Google OAuth Setup

- Update Google Console redirect URIs
- Add https://sheets.gopafy.com/auth/callback
- Update .env with production client ID

### 8. Test Live Site

- Visit https://sheets.gopafy.com
- Test all functionality
- Check SSL padlock icon
- Verify Google OAuth login works
- Test form submissions

## Post-Deployment

### ✅ Immediate Actions

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Test with Google Rich Results Test
- [ ] Check Google PageSpeed Insights
- [ ] Verify in GTmetrix
- [ ] Monitor error logs for 24 hours

### ✅ SEO Submission

- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Submit to Yandex Webmaster
- [ ] Create Google Business Profile
- [ ] Submit to relevant directories

### ✅ Monitoring Setup

- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure performance monitoring
- [ ] Set up error alerts
- [ ] Monitor Core Web Vitals
- [ ] Track conversion rates

### ✅ Marketing

- [ ] Share on social media
- [ ] Email announcement to users
- [ ] Update email signatures
- [ ] Create launch blog post
- [ ] Reach out to press/bloggers

## Performance Benchmarks

### Target Metrics

- **Lighthouse Performance**: > 90
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 300ms

### Current Results

```
Test Date: [Add date after deployment]
Lighthouse Performance: __/100
Lighthouse Accessibility: __/100
Lighthouse Best Practices: __/100
Lighthouse SEO: __/100
```

## Rollback Plan

If issues are discovered after deployment:

1. **Immediate Actions**

   - Revert to previous version from backup
   - Restore database if needed
   - Notify users if necessary

2. **File Restoration**

   ```bash
   # In hPanel File Manager
   # Navigate to backup folder
   # Restore previous dist/ folder
   ```

3. **DNS Reversion**

   - If DNS changes were made
   - Revert to previous DNS settings
   - Wait for propagation

4. **Communication**
   - Post status update on social media
   - Email affected users
   - Update status page

## Contact for Issues

- **Developer**: [Your Name]
- **Email**: hello@gopafy.com
- **Emergency**: [Emergency contact]
- **Hosting Support**: Hostinger Live Chat

## Notes

Last Updated: 2024-01-01
Deployment Date: [To be filled]
Deployed By: [To be filled]
Version: 1.0.0

---

**Remember**: Always test thoroughly in staging before deploying to production!
