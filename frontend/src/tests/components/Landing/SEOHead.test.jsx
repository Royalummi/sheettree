import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import SEOHead from "../../../components/Landing/SEOHead";

describe("SEOHead Component", () => {
  beforeEach(() => {
    // Clear any previous helmet state
    document.head.innerHTML = "";
  });

  it("renders without crashing", () => {
    render(
      <HelmetProvider>
        <SEOHead />
      </HelmetProvider>
    );
  });

  it("sets correct page title", () => {
    render(
      <HelmetProvider>
        <SEOHead />
      </HelmetProvider>
    );

    // Wait for helmet to update the document
    setTimeout(() => {
      expect(document.title).toContain("SheetTree");
      expect(document.title).toContain("Custom Form Builder");
    }, 100);
  });

  it("includes primary keywords in meta description", () => {
    render(
      <HelmetProvider>
        <SEOHead />
      </HelmetProvider>
    );

    setTimeout(() => {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      expect(metaDescription?.getAttribute("content")).toContain(
        "custom forms"
      );
      expect(metaDescription?.getAttribute("content")).toContain(
        "Google Sheets"
      );
    }, 100);
  });

  it("includes Open Graph meta tags", () => {
    render(
      <HelmetProvider>
        <SEOHead />
      </HelmetProvider>
    );

    setTimeout(() => {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      const ogType = document.querySelector('meta[property="og:type"]');

      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      expect(ogType?.getAttribute("content")).toBe("website");
    }, 100);
  });

  it("includes Twitter Card meta tags", () => {
    render(
      <HelmetProvider>
        <SEOHead />
      </HelmetProvider>
    );

    setTimeout(() => {
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');

      expect(twitterCard?.getAttribute("content")).toBe("summary_large_image");
      expect(twitterTitle).toBeTruthy();
    }, 100);
  });

  it("includes structured data (JSON-LD)", () => {
    render(
      <HelmetProvider>
        <SEOHead />
      </HelmetProvider>
    );

    setTimeout(() => {
      const structuredData = document.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(structuredData).toBeTruthy();

      const jsonData = JSON.parse(structuredData?.textContent || "{}");
      expect(jsonData["@type"]).toBe("SoftwareApplication");
      expect(jsonData.name).toContain("SheetTree");
    }, 100);
  });

  it("sets canonical URL", () => {
    render(
      <HelmetProvider>
        <SEOHead />
      </HelmetProvider>
    );

    setTimeout(() => {
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical?.getAttribute("href")).toContain("sheets.gopafy.com");
    }, 100);
  });

  it("includes target keywords", () => {
    render(
      <HelmetProvider>
        <SEOHead />
      </HelmetProvider>
    );

    setTimeout(() => {
      const keywords = document.querySelector('meta[name="keywords"]');
      const keywordContent = keywords?.getAttribute("content") || "";

      expect(keywordContent).toContain("custom form builder");
      expect(keywordContent).toContain("google sheets integration");
      expect(keywordContent).toContain("form to google sheets");
    }, 100);
  });
});
