import axios from "axios";

// API Gateway configuration
const API_GATEWAY_URL = "http://localhost:8000/api.php";

// Create axios instance with custom request logic
const api = {
  async request(config) {
    // Transform the URL to use API Gateway format
    const path = config.url?.startsWith("/")
      ? config.url.substring(1)
      : config.url;
    const gatewayUrl = `${API_GATEWAY_URL}?path=${encodeURIComponent(path)}`;

    // Add auth token if available
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Make the actual request
    try {
      const response = await axios({
        ...config,
        url: gatewayUrl,
        headers,
        timeout: 15000,
      });
      return response;
    } catch (error) {
      // Handle auth errors
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
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

  async patch(url, data, config = {}) {
    return this.request({ ...config, method: "PATCH", url, data });
  },
};

export default api;
