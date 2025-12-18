# SheetTree Landing Page

A modern, animated, production-ready landing page for SheetTree - Custom Form Builder with Google Sheets Integration.

## 🎨 Design Features

### Visual Design

- **Modern Gradient Aesthetics**: Purple-to-cyan gradient theme throughout
- **Glassmorphism Effects**: Backdrop blur and semi-transparent cards
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark Mode Ready**: Optimized color schemes for light and dark themes

### Animation Library Stack

- **Framer Motion**: Primary animation library for React components
- **GSAP**: Additional animations and scroll triggers
- **React Intersection Observer**: Scroll-triggered animations
- **Lottie React**: Lightweight animation support

### Component Architecture

```
frontend/src/
├── components/Landing/
│   ├── SEOHead.jsx           # Comprehensive SEO optimization
│   ├── HeroSection.jsx       # Main hero with CTA
│   ├── FeaturesSection.jsx   # 8 feature cards
│   ├── HowItWorksSection.jsx # 4-step process
│   ├── StatsSection.jsx      # Social proof + testimonial
│   ├── PricingSection.jsx    # Free & Premium plans
│   ├── CTASection.jsx        # Final call-to-action
│   └── Footer.jsx            # Footer with links
├── pages/Landing/
│   └── LandingPage.jsx       # Main wrapper component
└── tests/components/Landing/
    ├── SEOHead.test.jsx
    ├── HeroSection.test.jsx
    ├── FeaturesSection.test.jsx
    └── PricingSection.test.jsx
```

## 🚀 Key Sections

### 1. Hero Section

- **Left Column**: Headline, value proposition, dual CTAs
- **Right Column**: Glassmorphic dashboard preview with stats
- **Animations**: Floating emojis, gradient blobs, staggered entrance
- **Trust Indicators**: Security badge, real-time sync badge
- **Partner Logos**: Google, Slack, Zapier, Notion

### 2. Features Section

8 core features with hover animations:

1. **Custom Form Builder** - Drag-and-drop interface
2. **Google Sheets Integration** - Seamless connection
3. **Real-time Sync** - Instant data synchronization
4. **Email Notifications** - Automated alerts
5. **Webhook Support** - Developer integrations
6. **External API** - RESTful API access
7. **Enterprise Security** - Bank-level encryption
8. **Analytics Dashboard** - Track performance

### 3. How It Works

4-step visualization:

1. Sign up with Google 🚀
2. Create your form ✏️
3. Connect Google Sheets 🔗
4. Start collecting data 📊

**Video Demo**: Placeholder for product demo video

### 4. Stats Section (Social Proof)

- **3,000+** Active Users
- **180K+** Forms Created
- **24%** Time Saved
- **99.9%** Uptime

**Customer Testimonial**: Sarah Chen, CEO, TechStart Inc.

### 5. Pricing Section

- **Free Plan**: £0 forever

  - 3 forms
  - 100 submissions/month
  - Basic features
  - Google Sheets integration
  - Community support

- **Premium Plan**: £6.99/month ⭐ Most Popular
  - Unlimited forms
  - Unlimited submissions
  - Advanced fields
  - Multi-sheet connections
  - Webhooks & API access
  - Custom branding
  - Priority support
  - Analytics dashboard

### 6. CTA Section

Final conversion push with:

- Compelling headline with gradient text
- "Join 3,000+ businesses" trust badge
- Dual CTA buttons (Free start + Learn more)
- Trust indicators (Free forever, No card needed, Cancel anytime)
- Animated background blobs

### 7. Footer

- **Brand**: Logo and tagline
- **Links**: Product, Company, Resources, Legal
- **Social Media**: Twitter, GitHub, LinkedIn, Email
- **Copyright**: © 2024 SheetTree by Gopafy

## 🎯 SEO Optimization

### Meta Tags

```html
<title>SheetTree - Custom Form Builder with Google Sheets Integration</title>
<meta name="description" content="Create beautiful custom forms..." />
<meta
  name="keywords"
  content="custom form builder, google sheets integration..."
/>
```

### Structured Data (JSON-LD)

```json
{
  "@type": "SoftwareApplication",
  "name": "SheetTree",
  "applicationCategory": "BusinessApplication",
  "aggregateRating": {
    "ratingValue": "4.8",
    "ratingCount": "1247"
  }
}
```

### Open Graph & Twitter Cards

- Complete OG tags for Facebook/LinkedIn sharing
- Twitter Card with large image support
- Optimized for social media previews

### Sitemap & Robots

- **sitemap.xml**: All public pages indexed
- **robots.txt**: Proper crawl directives
- **Canonical URLs**: Prevent duplicate content

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- React 18.3.1
- Vite 5.4.x

### Install Dependencies

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

Opens at http://localhost:5173 (or next available port)

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
npm test -- SEOHead.test.jsx
npm test -- HeroSection.test.jsx
npm test -- FeaturesSection.test.jsx
npm test -- PricingSection.test.jsx
```

### Test Coverage

```bash
npm run test:coverage
```

## 🎨 Customization Guide

### Color Scheme

Edit Tailwind CSS classes in components:

- **Primary**: `purple-500`, `purple-600`, `purple-900`
- **Secondary**: `cyan-500`, `cyan-600`
- **Accent**: Gradients from purple to cyan

### Content Updates

#### Update Hero Headline

Edit [HeroSection.jsx](../components/Landing/HeroSection.jsx#L45-L50)

#### Change Pricing

Edit [PricingSection.jsx](../components/Landing/PricingSection.jsx#L25-L67)

#### Modify Features

Edit [FeaturesSection.jsx](../components/Landing/FeaturesSection.jsx#L15-L78)

### SEO Keywords

Update [SEOHead.jsx](../components/Landing/SEOHead.jsx#L10-L15) with your target keywords

## 🚀 Deployment

### Build for Production

```bash
cd frontend
npm run build
```

### Deploy to Hostinger

Follow the comprehensive guide in `docs/HOSTINGER_DEPLOYMENT_GUIDE.md`

Key steps:

1. Build production bundle
2. Upload `dist/` folder to public_html
3. Configure .htaccess for SPA routing
4. Set up SSL certificate
5. Configure Google OAuth
6. Test thoroughly

### Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://sheets.gopafy.com/api
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

## 📊 Performance Optimization

### Lighthouse Scores Target

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

### Optimization Techniques

- ✅ Code splitting with React.lazy()
- ✅ Image optimization (WebP format)
- ✅ Minified CSS and JS
- ✅ Gzip compression
- ✅ CDN for static assets
- ✅ Lazy loading for below-fold content
- ✅ Preload critical resources

### Bundle Size

- **Initial Load**: ~150KB (gzipped)
- **Framer Motion**: ~40KB
- **React**: ~45KB
- **Tailwind CSS**: ~8KB (purged)

## 🔧 Troubleshooting

### Common Issues

**Issue**: Animations not working

```bash
# Check Framer Motion installation
npm list framer-motion
# Reinstall if needed
npm install framer-motion
```

**Issue**: SEO meta tags not updating

```bash
# Ensure react-helmet-async is properly wrapped
# Check HelmetProvider in App.jsx
```

**Issue**: Port 5173 already in use

```bash
# Kill existing process
npx kill-port 5173
# Or use different port
npm run dev -- --port 3000
```

## 📚 Dependencies

### Production Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.x",
  "framer-motion": "^11.x",
  "gsap": "^3.x",
  "react-helmet-async": "^2.x",
  "react-intersection-observer": "^9.x",
  "lottie-react": "^2.x",
  "lucide-react": "^0.x"
}
```

### Development Dependencies

```json
{
  "vite": "^5.4.19",
  "tailwindcss": "^3.x",
  "@vitejs/plugin-react": "^4.x",
  "vitest": "^1.x",
  "@testing-library/react": "^14.x"
}
```

## 🎯 Target Keywords

Primary keywords optimized for:

- "custom form builder"
- "google sheets integration"
- "form to google sheets"
- "online form builder"
- "data collection tool"

## 📞 Support

- **Email**: hello@gopafy.com
- **Website**: https://sheets.gopafy.com
- **Documentation**: /docs
- **GitHub Issues**: [Report a bug](https://github.com/Royalummi/sheettree/issues)

## 📄 License

© 2024 SheetTree by Gopafy. All rights reserved.

---

**Built with** ❤️ **for productivity**
