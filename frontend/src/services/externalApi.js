import api from "./api";
import axios from "axios";

export const externalApiService = {
  // Get all API configurations for the user
  getUserApiConfigs: async () => {
    const response = await api.get("/api/user/api-configs");
    return response.data;
  },

  // Create new API configuration
  createApiConfig: async (configData) => {
    const response = await api.post("/api/user/api-configs", configData);
    return response.data;
  },

  // Update API configuration
  updateApiConfig: async (id, configData) => {
    const response = await api.put(`/api/user/api-configs/${id}`, configData);
    return response.data;
  },

  // Delete API configuration
  deleteApiConfig: async (id) => {
    const response = await api.delete(`/api/user/api-configs/${id}`);
    return response.data;
  },

  // Get API usage statistics
  getApiStats: async (id) => {
    const response = await api.get(`/api/user/api-configs/${id}/stats`);
    return response.data;
  },

  // Regenerate API key
  regenerateApiKey: async (id) => {
    const response = await api.post(
      `/api/user/api-configs/${id}/regenerate-key`
    );
    return response.data;
  },

  // Test API endpoint (for testing purposes)
  testApiEndpoint: async (apiHash, testData, apiKey) => {
    // This will be called without authentication to test the external API
    const gatewayUrl = `http://localhost:8000/api.php?path=${encodeURIComponent(
      `api/external/submit/${apiHash}`
    )}`;

    const response = await axios.post(gatewayUrl, testData, {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  },

  // Get API configuration (public endpoint for docs)
  getPublicApiConfig: async (apiHash) => {
    const gatewayUrl = `http://localhost:8000/api.php?path=${encodeURIComponent(
      `api/external/config/${apiHash}`
    )}`;
    const response = await fetch(gatewayUrl);
    return response.json();
  },
};
