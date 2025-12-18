import api from "./api";

class EmbedService {
  constructor() {
    this.baseUrl = "http://localhost:8000";
  }

  // Get all forms available for embedding
  async getEmbeddableForms() {
    try {
      const response = await api.get("/forms");
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error("Error fetching embeddable forms:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  // Generate theme presets
  getThemePresets() {
    return {
      light: {
        theme: "light",
        backgroundColor: "#ffffff",
        primaryColor: "#7c3aed",
        textColor: "#1f2937",
        borderColor: "#e5e7eb",
      },
      dark: {
        theme: "dark",
        backgroundColor: "#1f2937",
        primaryColor: "#a78bfa",
        textColor: "#f9fafb",
        borderColor: "#374151",
      },
      minimal: {
        theme: "light",
        backgroundColor: "#ffffff",
        primaryColor: "#000000",
        textColor: "#000000",
        borderColor: "#e5e7eb",
      },
      colorful: {
        theme: "light",
        backgroundColor: "#fef3c7",
        primaryColor: "#f59e0b",
        textColor: "#78350f",
        borderColor: "#fbbf24",
      },
    };
  }

  // Generate embed code for a form (HTML format)
  generateEmbedCode(formId, options = {}) {
    const {
      width = "100%",
      height = "600px",
      theme = "light",
      borderRadius = "8px",
      border = "1px solid #e5e7eb",
      autoResize = true,
      responsive = true,
      hideHeader = false,
      animations = true,
      submitButtonText = "Submit",
    } = options;

    const embedUrl = this.generateEmbedUrl(formId, options);

    // Generate iframe attributes
    const iframeAttrs = {
      src: embedUrl,
      width: responsive ? "100%" : width,
      height: height,
      frameborder: "0",
      scrolling: "auto",
      allowtransparency: "true",
      loading: "lazy",
      "data-form-id": formId,
      style: `border: ${border}; border-radius: ${borderRadius}; ${
        responsive ? "max-width: 100%;" : ""
      }`,
    };

    // Convert attributes to string
    const attrString = Object.entries(iframeAttrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");

    let embedCode = `<!-- SheetTree Form Embed -->
<div id="sheettree-form-${formId}" class="sheettree-form-container">
  <iframe ${attrString}></iframe>
</div>`;

    // Add auto-resize script if enabled
    if (autoResize) {
      embedCode += `

<script>
  // Auto-resize iframe based on content
  (function() {
    window.addEventListener('message', function(event) {
      // Verify origin for security
      if (event.origin !== '${this.baseUrl}') return;
      
      if (event.data.type === 'FORM_RESIZE' && event.data.formId === '${formId}') {
        const iframe = document.querySelector('iframe[data-form-id="${formId}"]');
        if (iframe && event.data.height) {
          iframe.style.height = event.data.height + 'px';
        }
      }
      
      // Handle form submission success
      if (event.data.type === 'FORM_SUBMITTED' && event.data.formId === '${formId}') {
        console.log('Form submitted successfully:', event.data);
        // You can add custom logic here
      }
    });
  })();
</script>`;
    }

    return embedCode;
  }

  // Generate embed URL for preview
  generateEmbedUrl(formId, options = {}) {
    const {
      theme = "light",
      hideHeader = false,
      hideFooter = false,
      submitButtonText = "Submit",
      animations = true,
      backgroundColor = "#ffffff",
      primaryColor = "#7c3aed",
      textColor = "#1f2937",
      borderColor = "#e5e7eb",
      borderWidth = "1px",
      borderStyle = "solid",
      borderRadius = "8px",
      fontFamily = "Arial, sans-serif",
      fontSize = "16px",
      showFormTitle = false,
      formTitleText = "",
      formTitleSize = "24px",
      formTitleColor = "#1f2937",
      formTitleAlign = "left",
      customCSS = "",
    } = options;

    const params = new URLSearchParams({
      theme,
      hideHeader: hideHeader ? "1" : "0",
      hideFooter: hideFooter ? "1" : "0",
      submitButton: encodeURIComponent(submitButtonText),
      animations: animations ? "1" : "0",
      bgColor: backgroundColor.replace("#", ""),
      primaryColor: primaryColor.replace("#", ""),
      textColor: textColor.replace("#", ""),
      borderColor: borderColor.replace("#", ""),
      borderWidth,
      borderStyle,
      borderRadius,
      fontFamily: encodeURIComponent(fontFamily),
      fontSize,
      showFormTitle: showFormTitle ? "1" : "0",
      formTitleText: encodeURIComponent(formTitleText),
      formTitleSize,
      formTitleColor: formTitleColor.replace("#", ""),
      formTitleAlign,
    });

    if (customCSS) {
      params.append("customCSS", encodeURIComponent(customCSS));
    }

    return `${this.baseUrl}/embed/form/${formId}?${params.toString()}`;
  }

  // Generate React component code
  generateReactCode(formId, options = {}) {
    const {
      theme = "light",
      primaryColor = "#7c3aed",
      width = "100%",
      height = "600px",
      autoResize = true,
    } = options;

    return `import { EmbedForm } from '@sheettree/embed-react';

function MyComponent() {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  const handleLoad = () => {
    console.log('Form loaded');
  };

  return (
    <EmbedForm
      formId="${formId}"
      theme="${theme}"
      primaryColor="${primaryColor}"
      width="${width}"
      height="${height}"
      autoResize={${autoResize}}
      onSubmit={handleSubmit}
      onLoad={handleLoad}
    />
  );
}

export default MyComponent;`;
  }

  // Generate Vue component code
  generateVueCode(formId, options = {}) {
    const {
      theme = "light",
      primaryColor = "#7c3aed",
      width = "100%",
      height = "600px",
      autoResize = true,
    } = options;

    return `<template>
  <EmbedForm
    form-id="${formId}"
    theme="${theme}"
    primary-color="${primaryColor}"
    width="${width}"
    height="${height}"
    :auto-resize="${autoResize}"
    @submit="handleSubmit"
    @load="handleLoad"
  />
</template>

<script>
import { EmbedForm } from '@sheettree/embed-vue';

export default {
  name: 'MyFormComponent',
  components: {
    EmbedForm
  },
  methods: {
    handleSubmit(data) {
      console.log('Form submitted:', data);
    },
    handleLoad() {
      console.log('Form loaded');
    }
  }
};
</script>`;
  }

  // Generate WordPress shortcode
  generateWordPressCode(formId, options = {}) {
    const {
      theme = "light",
      width = "100%",
      height = "600px",
      hideHeader = false,
    } = options;

    const attrs = [
      `id="${formId}"`,
      `theme="${theme}"`,
      `width="${width}"`,
      `height="${height}"`,
      hideHeader ? 'hide_header="true"' : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `<!-- Add this shortcode to any page or post -->
[sheettree_form ${attrs}]

<!-- Or use in PHP template -->
<?php echo do_shortcode('[sheettree_form ${attrs}]'); ?>`;
  }

  // Generate Webflow embed code
  generateWebflowCode(formId, options = {}) {
    const embedUrl = this.generateEmbedUrl(formId, options);
    const { height = "600px" } = options;

    return `<!-- Add to Webflow Custom Code Embed -->
<div id="sheettree-form-${formId}" style="width: 100%; height: ${height};"></div>

<!-- Add to Page Settings > Before </body> tag -->
<script src="${this.baseUrl}/embed.js"></script>
<script>
  SheetTreeEmbed.init({
    containerId: 'sheettree-form-${formId}',
    formId: '${formId}',
    embedUrl: '${embedUrl}'
  });
</script>`;
  }

  // Get code by format
  getCodeByFormat(format, formId, options = {}) {
    switch (format) {
      case "html":
        return this.generateEmbedCode(formId, options);
      case "react":
        return this.generateReactCode(formId, options);
      case "vue":
        return this.generateVueCode(formId, options);
      case "wordpress":
        return this.generateWordPressCode(formId, options);
      case "webflow":
        return this.generateWebflowCode(formId, options);
      default:
        return this.generateEmbedCode(formId, options);
    }
  }

  // Get embed statistics (if needed for analytics)
  async getEmbedStats(formId) {
    try {
      const response = await api.get(`/forms/${formId}/embed-stats`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching embed stats:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  // Validate form for embedding
  async validateFormForEmbed(formId) {
    try {
      const response = await api.get(`/forms/${formId}/embed-validate`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  // Copy embed code to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);

      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return { success: true };
      } catch (fallbackError) {
        return {
          success: false,
          error: "Failed to copy to clipboard. Please copy manually.",
        };
      }
    }
  }

  // Get CORS-friendly embed options
  getCorsOptions() {
    return {
      allowedOrigins: [
        "https://*.com",
        "https://*.net",
        "https://*.org",
        "http://localhost:*",
        "https://localhost:*",
      ],
      allowedMethods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: false, // For security with public embeds
    };
  }

  // Generate advanced embed configurations
  generateAdvancedConfig(formId, options = {}) {
    const {
      customCSS = "",
      onSubmitCallback = "",
      onLoadCallback = "",
      validationMessages = {},
      submitButtonText = "Submit",
      theme = "light",
      animations = true,
    } = options;

    return {
      formId,
      theme,
      animations,
      submitButtonText,
      customCSS,
      callbacks: {
        onLoad: onLoadCallback,
        onSubmit: onSubmitCallback,
      },
      validation: validationMessages,
      cors: this.getCorsOptions(),
    };
  }
}

export const embedService = new EmbedService();
export default embedService;
