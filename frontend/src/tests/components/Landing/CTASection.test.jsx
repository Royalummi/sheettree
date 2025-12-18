import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CTASection from "../../../components/Landing/CTASection";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

// Mock react-intersection-observer
vi.mock("react-intersection-observer", () => ({
  useInView: () => [vi.fn(), true],
}));

describe("CTASection Component", () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("renders without crashing", () => {
    renderWithRouter(<CTASection />);
  });

  it("displays main headline", () => {
    renderWithRouter(<CTASection />);

    const headline = screen.getByText(/Ready to level up/i);
    expect(headline).toBeTruthy();
  });

  it("shows gradient text in headline", () => {
    renderWithRouter(<CTASection />);

    const gradientText = screen.getByText(/data collection/i);
    expect(gradientText).toBeTruthy();
  });

  it("includes compelling description", () => {
    renderWithRouter(<CTASection />);

    const description = screen.getByText(/Start creating forms/i);
    expect(description).toBeTruthy();
  });

  it("displays primary CTA button", () => {
    renderWithRouter(<CTASection />);

    const primaryCTA = screen.getByText(/Start Free Today/i);
    expect(primaryCTA).toBeTruthy();
  });

  it("shows secondary CTA button", () => {
    renderWithRouter(<CTASection />);

    const secondaryCTA = screen.getByText(/Learn More/i);
    expect(secondaryCTA).toBeTruthy();
  });

  it("displays trust badge", () => {
    renderWithRouter(<CTASection />);

    const trustBadge = screen.getByText(/Join 3,000\+ businesses/i);
    expect(trustBadge).toBeTruthy();
  });

  it("shows all trust indicators", () => {
    renderWithRouter(<CTASection />);

    expect(screen.getByText(/Free forever plan/i)).toBeTruthy();
    expect(screen.getByText(/No credit card needed/i)).toBeTruthy();
    expect(screen.getByText(/Cancel anytime/i)).toBeTruthy();
  });

  it("emphasizes no commitment", () => {
    renderWithRouter(<CTASection />);

    const noCommitment = screen.getByText(/No credit card required/i);
    expect(noCommitment).toBeTruthy();
  });

  it("highlights pure productivity", () => {
    renderWithRouter(<CTASection />);

    const productivity = screen.getByText(/pure productivity/i);
    expect(productivity).toBeTruthy();
  });

  it("includes checkmark indicators", () => {
    renderWithRouter(<CTASection />);

    // Should have checkmarks (✓) for trust indicators
    const checkmarks = screen.getAllByText(/✓/);
    expect(checkmarks.length).toBe(3); // Three trust indicators
  });

  it("displays floating emoji decorations", () => {
    renderWithRouter(<CTASection />);

    // Rocket and star emojis should be present
    expect(screen.getByText(/🚀/)).toBeTruthy();
    expect(screen.getByText(/⭐/)).toBeTruthy();
  });

  it("uses dark gradient background theme", () => {
    const { container } = renderWithRouter(<CTASection />);

    const section = container.querySelector("section");
    expect(section).toBeTruthy();
  });
});
