import api from "./api";

export const formsService = {
  // Get all forms for the authenticated user
  getUserForms: async () => {
    const response = await api.get("/forms");
    return response.data;
  },

  // Create a new form
  createForm: async (formData) => {
    const response = await api.post("/forms", formData);
    return response.data;
  },

  // Get a specific form by ID
  getForm: async (id) => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },

  // Update a form
  updateForm: async (id, formData) => {
    const response = await api.put(`/forms/${id}`, formData);
    return response.data;
  },

  // Delete a form
  deleteForm: async (id) => {
    const response = await api.delete(`/forms/${id}`);
    return response.data;
  },

  // Submit data to a form
  submitForm: async (id, submissionData) => {
    const response = await api.post(`/forms/${id}/submit`, submissionData);
    return response.data;
  },

  // Get form submissions
  getFormSubmissions: async (id) => {
    const response = await api.get(`/forms/${id}/submissions`);
    return response.data;
  },
};

export default formsService;
