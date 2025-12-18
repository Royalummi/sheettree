import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "../../../components/Landing/Footer";

describe("Footer Component", () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("renders without crashing", () => {
    renderWithRouter(<Footer />);
  });

  it("displays brand logo and name", () => {
    renderWithRouter(<Footer />);

    const brandName = screen.getByText("SheetTree");
    expect(brandName).toBeTruthy();
  });

  it("shows tagline", () => {
    renderWithRouter(<Footer />);

    const tagline = screen.getByText(/Build beautiful forms/i);
    expect(tagline).toBeTruthy();
  });

  it("displays all link categories", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText("Product")).toBeTruthy();
    expect(screen.getByText("Company")).toBeTruthy();
    expect(screen.getByText("Resources")).toBeTruthy();
    expect(screen.getByText("Legal")).toBeTruthy();
  });

  it("shows product links", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText("Features")).toBeTruthy();
    expect(screen.getByText("Pricing")).toBeTruthy();
    expect(screen.getByText("Templates")).toBeTruthy();
    expect(screen.getByText("Integrations")).toBeTruthy();
  });

  it("displays company links", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText("About")).toBeTruthy();
    expect(screen.getByText("Blog")).toBeTruthy();
    expect(screen.getByText("Careers")).toBeTruthy();
    expect(screen.getByText("Contact")).toBeTruthy();
  });

  it("shows resource links", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText("Documentation")).toBeTruthy();
    expect(screen.getByText("API Reference")).toBeTruthy();
    expect(screen.getByText("Support")).toBeTruthy();
    expect(screen.getByText("Status")).toBeTruthy();
  });

  it("displays legal links", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText("Privacy")).toBeTruthy();
    expect(screen.getByText("Terms")).toBeTruthy();
    expect(screen.getByText("Security")).toBeTruthy();
    expect(screen.getByText("Cookies")).toBeTruthy();
  });

  it("includes social media links", () => {
    renderWithRouter(<Footer />);

    // Social media links should be present with aria-labels
    const socialLinks = screen.getAllByRole("link");
    const socialLabels = ["Twitter", "GitHub", "LinkedIn", "Email"];

    socialLabels.forEach((label) => {
      const link = socialLinks.find(
        (l) => l.getAttribute("aria-label") === label
      );
      expect(link).toBeTruthy();
    });
  });

  it("displays copyright notice", () => {
    renderWithRouter(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyright = screen.getByText(
      new RegExp(`© ${currentYear} SheetTree`, "i")
    );
    expect(copyright).toBeTruthy();
  });

  it("shows Gopafy attribution", () => {
    renderWithRouter(<Footer />);

    const attribution = screen.getByText(/by Gopafy/i);
    expect(attribution).toBeTruthy();
  });

  it("includes made with love message", () => {
    renderWithRouter(<Footer />);

    const loveMessage = screen.getByText(/Made with ❤️/i);
    expect(loveMessage).toBeTruthy();
  });

  it("displays website URL", () => {
    renderWithRouter(<Footer />);

    const websiteUrl = screen.getByText("sheets.gopafy.com");
    expect(websiteUrl).toBeTruthy();
  });

  it("has proper link structure", () => {
    renderWithRouter(<Footer />);

    const allLinks = screen.getAllByRole("link");
    // Should have multiple links (navigation + social)
    expect(allLinks.length).toBeGreaterThan(15);
  });
});
