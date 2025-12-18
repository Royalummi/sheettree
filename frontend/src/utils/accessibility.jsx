import React, { useEffect, useRef, useState, useId } from "react";

/**
 * Accessibility Enhancement Utilities
 * Ensures WCAG 2.1 AA compliance
 */

// Skip to main content link
export const SkipToMain = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
};

// Accessible form field wrapper
export const AccessibleField = ({
  id,
  label,
  error,
  helper,
  required,
  children,
}) => {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {React.cloneElement(children, {
        id,
        "aria-invalid": error ? "true" : "false",
        "aria-describedby":
          [error ? errorId : null, helper ? helperId : null]
            .filter(Boolean)
            .join(" ") || undefined,
        "aria-required": required ? "true" : "false",
      })}

      {helper && !error && (
        <p id={helperId} className="text-sm text-gray-500 dark:text-gray-400">
          {helper}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Focus trap for modals
export const useFocusTrap = (isActive = true) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};

// Accessible button with loading state
export const AccessibleButton = ({
  children,
  loading,
  disabled,
  loadingText = "Loading...",
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : "false"}
      aria-disabled={disabled || loading ? "true" : "false"}
    >
      {loading ? (
        <>
          <span className="sr-only">{loadingText}</span>
          <span aria-hidden="true">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Live region announcer
export const LiveRegion = ({ message, politeness = "polite" }) => {
  return (
    <div
      role={politeness === "assertive" ? "alert" : "status"}
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

// Keyboard navigation hook
export const useKeyboardNavigation = (items, onSelect) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          if (activeIndex >= 0 && activeIndex < items.length) {
            e.preventDefault();
            onSelect(items[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setActiveIndex(-1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, items, onSelect]);

  return { activeIndex, setActiveIndex };
};

// Color contrast checker
export const checkColorContrast = (foreground, background) => {
  const getLuminance = (color) => {
    const rgb = color.match(/\d+/g).map(Number);
    const [r, g, b] = rgb.map((val) => {
      val /= 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: ratio.toFixed(2),
    AA: ratio >= 4.5,
    AAA: ratio >= 7,
  };
};

// Screen reader only text
export const SROnly = ({ children }) => {
  return <span className="sr-only">{children}</span>;
};

// Accessible icon button
export const IconButton = ({ icon: Icon, label, ...props }) => {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      <SROnly>{label}</SROnly>
    </button>
  );
};

// Accessible tooltip
export const AccessibleTooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);
  const tooltipId = useId();

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        aria-describedby={show ? tooltipId : undefined}
      >
        {children}
      </div>
      {show && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2"
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Accessible tabs component
export const AccessibleTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div>
      <div
        role="tablist"
        className="flex space-x-2 border-b border-gray-200 dark:border-gray-700"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              activeTab === tab.id
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="mt-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

// Ensure minimum touch target size (44x44px for mobile)
export const TouchTarget = ({ children, ...props }) => {
  return (
    <div
      className="flex min-w-[44px] min-h-[44px] items-center justify-center"
      {...props}
    >
      {children}
    </div>
  );
};

// Add to global CSS for screen reader only utility
export const accessibilityStyles = `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Focus visible styles */
:focus-visible {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  button, a {
    border: 2px solid currentColor;
  }
}
`;

export default {
  SkipToMain,
  AccessibleField,
  AccessibleButton,
  LiveRegion,
  SROnly,
  IconButton,
  AccessibleTooltip,
  AccessibleTabs,
  TouchTarget,
  useFocusTrap,
  useKeyboardNavigation,
  checkColorContrast,
};
