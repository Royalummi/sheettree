import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const initiateGoogleAuth = createAsyncThunk(
  "auth/initiateGoogleAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/google");
      // Redirect to Google OAuth URL
      window.location.href = response.data.auth_url;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Authentication failed"
      );
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to get user profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put("/user/profile", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update profile"
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/refresh");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to refresh token"
      );
    }
  }
);

export const checkTokenStatus = createAsyncThunk(
  "auth/checkTokenStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/status");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to check token status"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // Store in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initiate Google Auth
      .addCase(initiateGoogleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateGoogleAuth.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiateGoogleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        // The response comes with { user: {...} }, so extract the user data
        const userData = action.payload.user || action.payload;
        state.user = userData;
        localStorage.setItem("user", JSON.stringify(userData));
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        // The response comes with { user: {...}, message: "..." }, so extract the user data
        const userData = action.payload.user || action.payload;
        state.user = userData;
        localStorage.setItem("user", JSON.stringify(userData));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Token Status
      .addCase(checkTokenStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkTokenStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally handle token status update in the state
      })
      .addCase(checkTokenStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout, clearError, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
