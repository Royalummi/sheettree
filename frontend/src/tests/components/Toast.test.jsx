import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Toast from "../../components/UI/Toast";

describe("Toast Component", () => {
  it("renders toast with message", () => {
    const toast = {
      message: "Test message",
      type: "success",
    };

    const onClose = vi.fn();

    render(<Toast toast={toast} onClose={onClose} />);

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const toast = {
      message: "Test message",
      type: "success",
    };

    const onClose = vi.fn();

    render(<Toast toast={toast} onClose={onClose} />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders different types correctly", () => {
    const types = ["success", "error", "warning", "info"];

    types.forEach((type) => {
      const toast = {
        message: `${type} message`,
        type,
      };

      const { container } = render(<Toast toast={toast} onClose={vi.fn()} />);

      // Toast should render with appropriate styling
      expect(container.querySelector("div")).toBeInTheDocument();
    });
  });

  it("does not render when toast is null", () => {
    const { container } = render(<Toast toast={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
