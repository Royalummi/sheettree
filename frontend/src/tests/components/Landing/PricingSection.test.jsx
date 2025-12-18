import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PricingSection from "../../../components/Landing/PricingSection";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

// Mock react-intersection-observer
vi.mock("react-intersection-observer", () => ({
  useInView: () => [vi.fn(), true],
}));

describe("PricingSection Component", () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("renders without crashing", () => {
    renderWithRouter(<PricingSection />);
  });

  it("displays section heading", () => {
    renderWithRouter(<PricingSection />);

    const heading = screen.getByText(/Simple, transparent pricing/i);
    expect(heading).toBeTruthy();
  });

  it("shows Free plan with correct pricing", () => {
    renderWithRouter(<PricingSection />);

    const freePlan = screen.getByText(/Free/i);
    const freePrice = screen.getByText(/£0/);

    expect(freePlan).toBeTruthy();
    expect(freePrice).toBeTruthy();
  });

  it("displays Premium plan with correct pricing", () => {
    renderWithRouter(<PricingSection />);

    const premiumPlan = screen.getByText(/Premium/i);
    const premiumPrice = screen.getByText(/£6.99/);

    expect(premiumPlan).toBeTruthy();
    expect(premiumPrice).toBeTruthy();
  });

  it('marks Premium plan as "Most Popular"', () => {
    renderWithRouter(<PricingSection />);

    const popularBadge = screen.getByText(/Most Popular/i);
    expect(popularBadge).toBeTruthy();
  });

  it("shows Free plan limitations", () => {
    renderWithRouter(<PricingSection />);

    const formsLimit = screen.getByText(/3 forms/i);
    const submissionsLimit = screen.getByText(/100 submissions\/month/i);

    expect(formsLimit).toBeTruthy();
    expect(submissionsLimit).toBeTruthy();
  });

  it("displays Premium plan unlimited features", () => {
    renderWithRouter(<PricingSection />);

    const unlimitedForms = screen.getByText(/Unlimited forms/i);
    const unlimitedSubmissions = screen.getByText(/Unlimited submissions/i);

    expect(unlimitedForms).toBeTruthy();
    expect(unlimitedSubmissions).toBeTruthy();
  });

  it("includes CTA buttons for both plans", () => {
    renderWithRouter(<PricingSection />);

    const freeButton = screen.getByRole("button", { name: /Start Free/i });
    const premiumButton = screen.getByRole("button", { name: /Get Premium/i });

    expect(freeButton).toBeTruthy();
    expect(premiumButton).toBeTruthy();
  });

  it("shows custom plan contact option", () => {
    renderWithRouter(<PricingSection />);

    const customPlanText = screen.getByText(/Need a custom plan/i);
    expect(customPlanText).toBeTruthy();
  });

  it("displays key Premium features", () => {
    renderWithRouter(<PricingSection />);

    // Check for premium-specific features
    expect(screen.getByText(/Priority support/i)).toBeTruthy();
    expect(screen.getByText(/Custom branding/i)).toBeTruthy();
    expect(screen.getByText(/API access/i)).toBeTruthy();
  });

  it("highlights Google Sheets integration in Free plan", () => {
    renderWithRouter(<PricingSection />);

    const sheetsIntegration = screen.getByText(/Google Sheets integration/i);
    expect(sheetsIntegration).toBeTruthy();
  });
});
