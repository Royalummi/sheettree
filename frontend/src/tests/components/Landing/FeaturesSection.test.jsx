import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FeaturesSection from "../../../components/Landing/FeaturesSection";

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

describe("FeaturesSection Component", () => {
  it("renders without crashing", () => {
    render(<FeaturesSection />);
  });

  it("displays section heading", () => {
    render(<FeaturesSection />);

    const heading = screen.getByText(/Everything you need/i);
    expect(heading).toBeTruthy();
  });

  it("shows all 8 features", () => {
    render(<FeaturesSection />);

    // Check for key features
    expect(screen.getByText(/Custom Form Builder/i)).toBeTruthy();
    expect(screen.getByText(/Google Sheets Integration/i)).toBeTruthy();
    expect(screen.getByText(/Real-time Sync/i)).toBeTruthy();
    expect(screen.getByText(/Email Notifications/i)).toBeTruthy();
    expect(screen.getByText(/Webhook Support/i)).toBeTruthy();
    expect(screen.getByText(/External API/i)).toBeTruthy();
    expect(screen.getByText(/Enterprise Security/i)).toBeTruthy();
    expect(screen.getByText(/Analytics Dashboard/i)).toBeTruthy();
  });

  it("displays feature descriptions", () => {
    render(<FeaturesSection />);

    const formBuilderDesc = screen.getByText(/Drag-and-drop interface/i);
    const sheetsDesc = screen.getByText(/Seamlessly connect/i);

    expect(formBuilderDesc).toBeTruthy();
    expect(sheetsDesc).toBeTruthy();
  });

  it("renders feature icons", () => {
    render(<FeaturesSection />);

    // Icons should be present in the DOM
    const icons = document.querySelectorAll(".lucide");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("includes security feature", () => {
    render(<FeaturesSection />);

    const securityFeature = screen.getByText(/Enterprise Security/i);
    const encryptionText = screen.getByText(/Bank-level encryption/i);

    expect(securityFeature).toBeTruthy();
    expect(encryptionText).toBeTruthy();
  });

  it("highlights analytics capability", () => {
    render(<FeaturesSection />);

    const analyticsFeature = screen.getByText(/Analytics Dashboard/i);
    const insightsText = screen.getByText(/Track submissions/i);

    expect(analyticsFeature).toBeTruthy();
    expect(insightsText).toBeTruthy();
  });

  it("emphasizes real-time functionality", () => {
    render(<FeaturesSection />);

    const realtimeFeature = screen.getByText(/Real-time Sync/i);
    const instantText = screen.getByText(/Instant data synchronization/i);

    expect(realtimeFeature).toBeTruthy();
    expect(instantText).toBeTruthy();
  });
});
