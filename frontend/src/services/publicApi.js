import axios from "axios";

// API Gateway configuration for public endpoints
const API_GATEWAY_URL = "http://localhost:8000/api.php";

// Create public API service using the same gateway pattern
const publicApi = {
  async request(config) {
    // Transform the URL to use API Gateway format
    const path = config.url?.startsWith("/")
      ? config.url.substring(1)
      : config.url;
    const gatewayUrl = `${API_GATEWAY_URL}?path=${encodeURIComponent(path)}`;

    const headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    // Make the actual request
    try {
      console.log(
        "Public API Request:",
        config.method?.toUpperCase(),
        config.url,
        "->",
        gatewayUrl
      );
      console.log("Request data:", config.data);

      const response = await axios({
        ...config,
        url: gatewayUrl,
        headers,
        timeout: 15000,
      });
      return response;
    } catch (error) {
      console.error("Public API Error:", error);
      console.error("Error config:", error.config);
      console.error("Error response:", error.response);
      throw error;
    }
  },

  async get(url, config = {}) {
    return this.request({ ...config, method: "GET", url });
  },

  async post(url, data, config = {}) {
    return this.request({ ...config, method: "POST", url, data });
  },

  async put(url, data, config = {}) {
    return this.request({ ...config, method: "PUT", url, data });
  },

  async delete(url, config = {}) {
    return this.request({ ...config, method: "DELETE", url });
  },
};

export default publicApi;
