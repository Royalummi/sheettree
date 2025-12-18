import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const getUserForms = createAsyncThunk(
  "forms/getUserForms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/forms");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch forms"
      );
    }
  }
);

export const createForm = createAsyncThunk(
  "forms/createForm",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/forms", formData);
      return response.data.form || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create form"
      );
    }
  }
);

export const getForm = createAsyncThunk(
  "forms/getForm",
  async (formId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/forms/${formId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch form"
      );
    }
  }
);

export const updateForm = createAsyncThunk(
  "forms/updateForm",
  async ({ id, ...formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/forms/${id}`, formData);
      return response.data.form || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update form"
      );
    }
  }
);

export const deleteForm = createAsyncThunk(
  "forms/deleteForm",
  async (formId, { rejectWithValue }) => {
    try {
      await api.delete(`/forms/${formId}`);
      return formId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete form"
      );
    }
  }
);

export const submitForm = createAsyncThunk(
  "forms/submitForm",
  async ({ formId, submissionData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/forms/${formId}/submit`,
        submissionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to submit form"
      );
    }
  }
);

export const getFormSubmissions = createAsyncThunk(
  "forms/getFormSubmissions",
  async (formId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/forms/${formId}/submissions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch form submissions"
      );
    }
  }
);

const formsSlice = createSlice({
  name: "forms",
  initialState: {
    forms: [],
    currentForm: null,
    selectedForm: null,
    submissions: [],
    loading: false,
    error: null,
    submissionLoading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedForm: (state, action) => {
      state.selectedForm = action.payload;
    },
    clearSubmissions: (state) => {
      state.submissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Forms
      .addCase(getUserForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.forms || [];
      })
      .addCase(getUserForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Form
      .addCase(createForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms.push(action.payload);
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Form
      .addCase(getForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getForm.fulfilled, (state, action) => {
        state.loading = false;
        state.currentForm = action.payload;
      })
      .addCase(getForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Form
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.forms.findIndex(
          (form) => form.id === action.payload.id
        );
        if (index !== -1) {
          state.forms[index] = action.payload;
        }
        state.currentForm = action.payload;
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Form
      .addCase(deleteForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = state.forms.filter((form) => form.id !== action.payload);
        if (state.selectedForm?.id === action.payload) {
          state.selectedForm = null;
        }
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit Form
      .addCase(submitForm.pending, (state) => {
        state.submissionLoading = true;
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state) => {
        state.submissionLoading = false;
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.submissionLoading = false;
        state.error = action.payload;
      })

      // Get Form Submissions
      .addCase(getFormSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFormSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(getFormSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedForm, clearSubmissions } =
  formsSlice.actions;
export default formsSlice.reducer;
