import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchMyStats = createAsyncThunk(
  "analytics/myStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/my-stats");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics"
      );
    }
  }
);

export const fetchStreakCalendar = createAsyncThunk(
  "analytics/streakCalendar",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/streak-calendar");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch streak calendar"
      );
    }
  }
);

export const fetchTopAuthors = createAsyncThunk(
  "analytics/topAuthors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/top-authors");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top authors"
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    stats: null,
    calendar: [],
    topAuthors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchMyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchStreakCalendar.fulfilled, (state, action) => {
        state.calendar = action.payload.calendar;
      });

    builder
      .addCase(fetchTopAuthors.fulfilled, (state, action) => {
        state.topAuthors = action.payload.topAuthors;
      });
  },
});

export default analyticsSlice.reducer;
