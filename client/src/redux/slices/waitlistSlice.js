import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const joinWaitlist = createAsyncThunk(
  "waitlist/join",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/waitlist/${bookId}`);
      return { ...data, bookId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to join waitlist"
      );
    }
  }
);

export const leaveWaitlist = createAsyncThunk(
  "waitlist/leave",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/waitlist/${bookId}`);
      return { ...data, bookId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to leave waitlist"
      );
    }
  }
);

export const getMyWaitlist = createAsyncThunk(
  "waitlist/myList",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/waitlist/my-waitlist");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch waitlist"
      );
    }
  }
);

export const getWaitlistPosition = createAsyncThunk(
  "waitlist/position",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/waitlist/${bookId}/position`);
      return { ...data, bookId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch position"
      );
    }
  }
);

export const claimWaitlistSlot = createAsyncThunk(
  "waitlist/claim",
  async (bookId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/waitlist/${bookId}/claim`);
      return { ...data, bookId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to claim slot"
      );
    }
  }
);

const waitlistSlice = createSlice({
  name: "waitlist",
  initialState: {
    myWaitlist: [],
    // Map of bookId -> { onWaitlist, position, totalWaiting }
    positions: {},
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearWaitlistState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.positions[action.payload.bookId] = {
          onWaitlist: true,
          position: action.payload.position,
        };
      })
      .addCase(joinWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(leaveWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.positions[action.payload.bookId] = {
          onWaitlist: false,
          position: null,
        };
        state.myWaitlist = state.myWaitlist.filter(
          (e) => e.book?._id !== action.payload.bookId
        );
      })
      .addCase(leaveWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getMyWaitlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.myWaitlist = action.payload.waitlist;
      })
      .addCase(getMyWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getWaitlistPosition.fulfilled, (state, action) => {
        state.positions[action.payload.bookId] = {
          onWaitlist: action.payload.onWaitlist,
          position: action.payload.position,
          status: action.payload.status,
          expiresAt: action.payload.expiresAt,
          totalWaiting: action.payload.totalWaiting,
        };
      });

    builder
      .addCase(claimWaitlistSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(claimWaitlistSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.positions[action.payload.bookId] = {
          onWaitlist: false,
          position: null,
        };
      })
      .addCase(claimWaitlistSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWaitlistState } = waitlistSlice.actions;
export default waitlistSlice.reducer;
