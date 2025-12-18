import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HowItWorksSection from "../../../components/Landing/HowItWorksSection";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
}));

// Mock react-intersection-observer
vi.mock("react-intersection-observer", () => ({
  useInView: () => [vi.fn(), true],
}));

describe("HowItWorksSection Component", () => {
  it("renders without crashing", () => {
    render(<HowItWorksSection />);
  });

  it("displays section heading", () => {
    render(<HowItWorksSection />);

    const heading = screen.getByText(/How it works/i);
    expect(heading).toBeTruthy();
  });

  it("shows all 4 steps", () => {
    render(<HowItWorksSection />);

    expect(screen.getByText(/Sign up with Google/i)).toBeTruthy();
    expect(screen.getByText(/Create your form/i)).toBeTruthy();
    expect(screen.getByText(/Connect Google Sheets/i)).toBeTruthy();
    expect(screen.getByText(/Start collecting data/i)).toBeTruthy();
  });

  it("displays step descriptions", () => {
    render(<HowItWorksSection />);

    expect(screen.getByText(/Quick OAuth sign-in/i)).toBeTruthy();
    expect(screen.getByText(/drag-and-drop builder/i)).toBeTruthy();
    expect(screen.getByText(/Link your spreadsheet/i)).toBeTruthy();
    expect(screen.getByText(/Watch submissions flow/i)).toBeTruthy();
  });

  it("includes video demo section", () => {
    render(<HowItWorksSection />);

    const videoHeading = screen.getByText(/Watch SheetTree in Action/i);
    const videoDescription = screen.getByText(/See how easy it is/i);

    expect(videoHeading).toBeTruthy();
    expect(videoDescription).toBeTruthy();
  });

  it("displays numbered steps", () => {
    render(<HowItWorksSection />);

    // Check for step numbers 1-4
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
  });

  it("shows emojis for each step", () => {
    render(<HowItWorksSection />);

    // Emojis should be present in the DOM
    expect(screen.getByText(/🚀/)).toBeTruthy();
    expect(screen.getByText(/✏️/)).toBeTruthy();
    expect(screen.getByText(/🔗/)).toBeTruthy();
    expect(screen.getByText(/📊/)).toBeTruthy();
  });

  it("includes play button for video", () => {
    render(<HowItWorksSection />);

    // Play button should have specific styling
    const playButtons = screen.getAllByRole("button");
    expect(playButtons.length).toBeGreaterThan(0);
  });

  it("displays section subtitle", () => {
    render(<HowItWorksSection />);

    const subtitle = screen.getByText(/Get started in minutes/i);
    expect(subtitle).toBeTruthy();
  });

  it("emphasizes simplicity", () => {
    render(<HowItWorksSection />);

    // Check for messaging about ease of use
    expect(screen.getByText(/no code required/i)).toBeTruthy();
  });
});
