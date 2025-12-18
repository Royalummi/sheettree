import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks
export const getUserSheets = createAsyncThunk(
  "sheets/getUserSheets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/sheets");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch sheets"
      );
    }
  }
);

export const connectSheet = createAsyncThunk(
  "sheets/connectSheet",
  async (sheetData, { rejectWithValue }) => {
    try {
      const response = await api.post("/sheets/connect", sheetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to connect sheet"
      );
    }
  }
);

export const connectSheetFromPicker = createAsyncThunk(
  "sheets/connectSheetFromPicker",
  async (pickerData, { rejectWithValue }) => {
    try {
      const response = await api.post("/sheets/connect/picker", pickerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to connect sheet from picker"
      );
    }
  }
);

export const disconnectSheet = createAsyncThunk(
  "sheets/disconnectSheet",
  async (sheetId, { rejectWithValue }) => {
    try {
      await api.delete(`/sheets/${sheetId}`);
      return sheetId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to disconnect sheet"
      );
    }
  }
);

export const previewSheet = createAsyncThunk(
  "sheets/previewSheet",
  async (sheetId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/sheets/${sheetId}/preview`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to preview sheet"
      );
    }
  }
);

const sheetsSlice = createSlice({
  name: "sheets",
  initialState: {
    sheets: [],
    selectedSheet: null,
    previewData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPreview: (state) => {
      state.previewData = null;
    },
    setSelectedSheet: (state, action) => {
      state.selectedSheet = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Sheets
      .addCase(getUserSheets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserSheets.fulfilled, (state, action) => {
        state.loading = false;
        state.sheets = action.payload.sheets || [];
      })
      .addCase(getUserSheets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Connect Sheet
      .addCase(connectSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.sheets.push(action.payload);
      })
      .addCase(connectSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Connect Sheet From Picker
      .addCase(connectSheetFromPicker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectSheetFromPicker.fulfilled, (state, action) => {
        state.loading = false;
        state.sheets.push(action.payload);
      })
      .addCase(connectSheetFromPicker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Disconnect Sheet
      .addCase(disconnectSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disconnectSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.sheets = state.sheets.filter(
          (sheet) => sheet.id !== action.payload
        );
      })
      .addCase(disconnectSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Preview Sheet
      .addCase(previewSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(previewSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.previewData = action.payload;
      })
      .addCase(previewSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearPreview, setSelectedSheet } =
  sheetsSlice.actions;
export default sheetsSlice.reducer;
