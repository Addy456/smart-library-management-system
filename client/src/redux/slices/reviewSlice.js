import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getBookReviews = createAsyncThunk(
  "reviews/getForBook",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews/${bookId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/add",
  async ({ bookId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/reviews/${bookId}`, { rating, comment });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

export const checkCanReview = createAsyncThunk(
  "reviews/canReview",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews/${bookId}/can-review`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check review eligibility"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    canReview: false,
    alreadyReviewed: false,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearReviewState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(getBookReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.reviews.unshift(action.payload.review);
        state.canReview = false;
        state.alreadyReviewed = true;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(checkCanReview.fulfilled, (state, action) => {
        state.canReview = action.payload.canReview;
        state.alreadyReviewed = action.payload.alreadyReviewed;
      });
  },
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
