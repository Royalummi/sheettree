import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HeroSection from "../../../components/Landing/HeroSection";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

// Mock react-intersection-observer
vi.mock("react-intersection-observer", () => ({
  useInView: () => [vi.fn(), true],
}));

describe("HeroSection Component", () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("renders without crashing", () => {
    renderWithRouter(<HeroSection />);
  });

  it("displays main headline", () => {
    renderWithRouter(<HeroSection />);

    const headline = screen.getByText(/Build Custom Forms/i);
    expect(headline).toBeTruthy();
  });

  it("shows primary CTA button", () => {
    renderWithRouter(<HeroSection />);

    const ctaButton = screen.getByText(/Get Started Free/i);
    expect(ctaButton).toBeTruthy();
  });

  it("displays secondary CTA button", () => {
    renderWithRouter(<HeroSection />);

    const secondaryButton = screen.getByText(/Watch Demo/i);
    expect(secondaryButton).toBeTruthy();
  });

  it("shows key value proposition", () => {
    renderWithRouter(<HeroSection />);

    const valueProposition = screen.getByText(/Google Sheets/i);
    expect(valueProposition).toBeTruthy();
  });

  it("displays trust indicators", () => {
    renderWithRouter(<HeroSection />);

    const securityBadge = screen.getByText(/Bank-level security/i);
    const realtimeBadge = screen.getByText(/Real-time sync/i);

    expect(securityBadge).toBeTruthy();
    expect(realtimeBadge).toBeTruthy();
  });

  it("shows statistics in dashboard preview", () => {
    renderWithRouter(<HeroSection />);

    const submissionsStat = screen.getByText(/12,580/);
    const formsStat = screen.getByText(/47/);
    const sheetsStat = screen.getByText(/23/);

    expect(submissionsStat).toBeTruthy();
    expect(formsStat).toBeTruthy();
    expect(sheetsStat).toBeTruthy();
  });

  it("displays partner logos section", () => {
    renderWithRouter(<HeroSection />);

    const integrationsText = screen.getByText(/Integrates with/i);
    expect(integrationsText).toBeTruthy();
  });

  it("includes call-to-action messaging", () => {
    renderWithRouter(<HeroSection />);

    const noCard = screen.getByText(/No credit card required/i);
    const freeTrial = screen.getByText(/free forever plan/i);

    expect(noCard).toBeTruthy();
    expect(freeTrial).toBeTruthy();
  });
});
