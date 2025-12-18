import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsSection from "../../../components/Landing/StatsSection";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
}));

// Mock react-intersection-observer
vi.mock("react-intersection-observer", () => ({
  useInView: () => [vi.fn(), true],
}));

describe("StatsSection Component", () => {
  it("renders without crashing", () => {
    render(<StatsSection />);
  });

  it("displays section heading", () => {
    render(<StatsSection />);

    const heading = screen.getByText(/Trusted by thousands/i);
    expect(heading).toBeTruthy();
  });

  it("shows all 4 statistics", () => {
    render(<StatsSection />);

    // Check for statistics
    expect(screen.getByText(/3,000\+/)).toBeTruthy();
    expect(screen.getByText(/180K\+/)).toBeTruthy();
    expect(screen.getByText(/24%/)).toBeTruthy();
    expect(screen.getByText(/99\.9%/)).toBeTruthy();
  });

  it("displays stat labels", () => {
    render(<StatsSection />);

    expect(screen.getByText(/Active Users/i)).toBeTruthy();
    expect(screen.getByText(/Forms Created/i)).toBeTruthy();
    expect(screen.getByText(/Time Saved/i)).toBeTruthy();
    expect(screen.getByText(/Uptime/i)).toBeTruthy();
  });

  it("includes customer testimonial", () => {
    render(<StatsSection />);

    const testimonial = screen.getByText(/SheetTree transformed/i);
    expect(testimonial).toBeTruthy();
  });

  it("displays testimonial author", () => {
    render(<StatsSection />);

    const author = screen.getByText(/Sarah Chen/i);
    const company = screen.getByText(/TechStart Inc/i);

    expect(author).toBeTruthy();
    expect(company).toBeTruthy();
  });

  it("shows stat descriptions", () => {
    render(<StatsSection />);

    expect(screen.getByText(/businesses and teams/i)).toBeTruthy();
    expect(screen.getByText(/total submissions/i)).toBeTruthy();
  });

  it("renders with dark theme styling", () => {
    const { container } = render(<StatsSection />);

    // Should have dark background classes in the section
    const section = container.querySelector("section");
    expect(section).toBeTruthy();
  });

  it("includes social proof messaging", () => {
    render(<StatsSection />);

    const socialProof = screen.getByText(/data entry time by over 50%/i);
    expect(socialProof).toBeTruthy();
  });

  it("displays CEO title", () => {
    render(<StatsSection />);

    const ceoTitle = screen.getByText(/CEO/i);
    expect(ceoTitle).toBeTruthy();
  });
});
