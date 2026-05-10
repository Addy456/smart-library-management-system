import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getRecommendations = createAsyncThunk(
  "recommendations/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/recommendations");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recommendations"
      );
    }
  }
);

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState: {
    recommendations: [],
    favouriteCategories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.recommendations;
        state.favouriteCategories = action.payload.favouriteCategories;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recommendationSlice.reducer;
