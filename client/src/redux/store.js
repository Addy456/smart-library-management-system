import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import borrowReducer from "./slices/borrowSlice";
import userReducer from "./slices/userSlice";
import recommendationReducer from "./slices/recommendationSlice";
import reviewReducer from "./slices/reviewSlice";
import waitlistReducer from "./slices/waitlistSlice";
import analyticsReducer from "./slices/analyticsSlice";

// Configure Redux store with all slices
const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    borrow: borrowReducer,
    users: userReducer,
    recommendations: recommendationReducer,
    reviews: reviewReducer,
    waitlist: waitlistReducer,
    analytics: analyticsReducer,
  },
});

export default store;
