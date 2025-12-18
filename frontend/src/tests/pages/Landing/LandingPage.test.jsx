import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LandingPage from "../../../pages/Landing/LandingPage";

// Mock all child components to avoid complex dependencies
vi.mock("../../../components/Landing/SEOHead", () => ({
  default: () => <div data-testid="seo-head">SEO Head</div>,
}));

vi.mock("../../../components/Landing/HeroSection", () => ({
  default: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock("../../../components/Landing/FeaturesSection", () => ({
  default: () => <div data-testid="features-section">Features Section</div>,
}));

vi.mock("../../../components/Landing/HowItWorksSection", () => ({
  default: () => (
    <div data-testid="how-it-works-section">How It Works Section</div>
  ),
}));

vi.mock("../../../components/Landing/StatsSection", () => ({
  default: () => <div data-testid="stats-section">Stats Section</div>,
}));

vi.mock("../../../components/Landing/PricingSection", () => ({
  default: () => <div data-testid="pricing-section">Pricing Section</div>,
}));

vi.mock("../../../components/Landing/CTASection", () => ({
  default: () => <div data-testid="cta-section">CTA Section</div>,
}));

vi.mock("../../../components/Landing/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe("LandingPage Integration", () => {
  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <HelmetProvider>{component}</HelmetProvider>
      </BrowserRouter>
    );
  };

  it("renders without crashing", () => {
    renderWithProviders(<LandingPage />);
  });

  it("renders SEO head component", () => {
    const { getByTestId } = renderWithProviders(<LandingPage />);
    expect(getByTestId("seo-head")).toBeTruthy();
  });

  it("renders hero section", () => {
    const { getByTestId } = renderWithProviders(<LandingPage />);
    expect(getByTestId("hero-section")).toBeTruthy();
  });

  it("renders features section", () => {
    const { getByTestId } = renderWithProviders(<LandingPage />);
    expect(getByTestId("features-section")).toBeTruthy();
  });

  it("renders how it works section", () => {
    const { getByTestId } = renderWithProviders(<LandingPage />);
    expect(getByTestId("how-it-works-section")).toBeTruthy();
  });

  it("renders stats section", () => {
    const { getByTestId } = renderWithProviders(<LandingPage />);
    expect(getByTestId("stats-section")).toBeTruthy();
  });

  it("renders pricing section", () => {
    const { getByTestId } = renderWithProviders(<LandingPage />);
    expect(getByTestId("pricing-section")).toBeTruthy();
  });

  it("renders CTA section", () => {
    const { getByTestId } = renderWithProviders(<LandingPage />);
    expect(getByTestId("cta-section")).toBeTruthy();
  });

  it("renders footer", () => {
    const { getByTestId } = renderWithProviders(<LandingPage />);
    expect(getByTestId("footer")).toBeTruthy();
  });

  it("renders all sections in correct order", () => {
    const { container } = renderWithProviders(<LandingPage />);

    const sections = container.querySelectorAll("[data-testid]");
    const sectionOrder = Array.from(sections).map((el) =>
      el.getAttribute("data-testid")
    );

    expect(sectionOrder).toEqual([
      "seo-head",
      "hero-section",
      "features-section",
      "how-it-works-section",
      "stats-section",
      "pricing-section",
      "cta-section",
      "footer",
    ]);
  });

  it("has proper semantic HTML structure", () => {
    const { container } = renderWithProviders(<LandingPage />);

    // Should have main content area
    const main = container.querySelector("main");
    expect(main).toBeTruthy();
  });

  it("applies white background", () => {
    const { container } = renderWithProviders(<LandingPage />);

    const wrapper = container.querySelector(".bg-white");
    expect(wrapper).toBeTruthy();
  });

  it("applies full height styling", () => {
    const { container } = renderWithProviders(<LandingPage />);

    const wrapper = container.querySelector(".min-h-screen");
    expect(wrapper).toBeTruthy();
  });
});
