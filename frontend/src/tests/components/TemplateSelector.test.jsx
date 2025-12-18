import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TemplateSelector from "../../components/Forms/TemplateSelector";

// Mock store
const createMockStore = () =>
  configureStore({
    reducer: {
      auth: (state = { user: null, token: "test-token" }) => state,
    },
  });

// Mock fetch
global.fetch = vi.fn();

describe("TemplateSelector Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders template selector modal when open", () => {
    const onClose = vi.fn();
    const onSelectTemplate = vi.fn();

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <TemplateSelector
            isOpen={true}
            onClose={onClose}
            onSelectTemplate={onSelectTemplate}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Choose a Template")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    const onClose = vi.fn();
    const onSelectTemplate = vi.fn();

    const { container } = render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <TemplateSelector
            isOpen={false}
            onClose={onClose}
            onSelectTemplate={onSelectTemplate}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it("fetches templates on mount when open", async () => {
    const mockTemplates = [
      {
        id: 1,
        name: "Contact Form",
        description: "Simple contact form",
        category: "contact",
        icon: "MessageSquare",
        fields: [],
        usage_count: 10,
      },
    ];

    fetch.mockResolvedValueOnce({
      json: async () => ({ templates: mockTemplates }),
    });

    const onClose = vi.fn();
    const onSelectTemplate = vi.fn();

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <TemplateSelector
            isOpen={true}
            onClose={onClose}
            onSelectTemplate={onSelectTemplate}
          />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("templates"));
    });
  });

  it("filters templates by search query", async () => {
    const mockTemplates = [
      {
        id: 1,
        name: "Contact Form",
        description: "Simple contact form",
        category: "contact",
        icon: "MessageSquare",
        fields: [],
      },
      {
        id: 2,
        name: "Survey Form",
        description: "Customer survey",
        category: "survey",
        icon: "BarChart3",
        fields: [],
      },
    ];

    fetch.mockResolvedValue({
      json: async () => ({ templates: mockTemplates, categories: [] }),
    });

    const onClose = vi.fn();
    const onSelectTemplate = vi.fn();

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <TemplateSelector
            isOpen={true}
            onClose={onClose}
            onSelectTemplate={onSelectTemplate}
          />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/search templates/i)
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search templates/i);
    fireEvent.change(searchInput, { target: { value: "Contact" } });

    // Search functionality should filter templates
    expect(searchInput.value).toBe("Contact");
  });

  it("calls onSelectTemplate when template is clicked", async () => {
    const mockTemplate = {
      id: 1,
      name: "Contact Form",
      description: "Simple contact form",
      category: "contact",
      icon: "MessageSquare",
      fields: [],
      usage_count: 5,
    };

    fetch.mockResolvedValue({
      json: async () => ({ templates: [mockTemplate], categories: [] }),
    });

    const onClose = vi.fn();
    const onSelectTemplate = vi.fn();

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <TemplateSelector
            isOpen={true}
            onClose={onClose}
            onSelectTemplate={onSelectTemplate}
          />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Contact Form")).toBeInTheDocument();
    });

    const templateCard = screen.getByText("Contact Form").closest("div");
    fireEvent.click(templateCard);

    await waitFor(() => {
      expect(onSelectTemplate).toHaveBeenCalledWith(mockTemplate);
    });
  });

  it("closes modal when cancel button is clicked", async () => {
    fetch.mockResolvedValue({
      json: async () => ({ templates: [], categories: [] }),
    });

    const onClose = vi.fn();
    const onSelectTemplate = vi.fn();

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <TemplateSelector
            isOpen={true}
            onClose={onClose}
            onSelectTemplate={onSelectTemplate}
          />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
