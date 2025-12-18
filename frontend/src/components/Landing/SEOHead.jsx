import { Helmet } from "react-helmet-async";

/**
 * SEO Head Component
 * Comprehensive SEO optimization for SheetTree landing page
 */
const SEOHead = () => {
  const siteUrl = "https://sheets.gopafy.com";
  const title =
    "SheetTree - Custom Form Builder with Google Sheets Integration";
  const description =
    "Create beautiful custom forms and automatically sync submissions to Google Sheets. Build forms, collect data, and streamline your workflow with our powerful form builder.";
  const keywords =
    "custom form builder, google sheets integration, form to google sheets, online form builder, data collection forms, form builder tool, google sheets forms, custom forms, web forms";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SheetTree",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1247",
    },
    description: description,
    operatingSystem: "Web",
    screenshot: `${siteUrl}/assets/screenshot.png`,
    featureList: [
      "Custom Form Builder",
      "Google Sheets Integration",
      "Real-time Data Sync",
      "Email Notifications",
      "Webhook Support",
      "Form Templates",
      "External API",
      "Analytics Dashboard",
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}/assets/og-image.png`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta
        property="twitter:image"
        content={`${siteUrl}/assets/twitter-image.png`}
      />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="SheetTree" />

      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
