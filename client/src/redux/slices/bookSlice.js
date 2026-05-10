import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunks for book operations

export const getAllBooks = createAsyncThunk(
  "books/getAll",
  async ({ search = "", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/books?search=${search}&page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch books");
    }
  }
);

export const getBookById = createAsyncThunk(
  "books/getById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/books/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch book");
    }
  }
);

export const addBook = createAsyncThunk(
  "books/add",
  async (bookData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/books", bookData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add book");
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/update",
  async ({ id, bookData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/books/${id}`, bookData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update book");
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/books/${id}`);
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete book");
    }
  }
);

// Book slice
const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    book: null,
    loading: false,
    error: null,
    totalBooks: 0,
    currentPage: 1,
    totalPages: 1,
    message: null,
  },
  reducers: {
    clearBookState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Get All Books
    builder
      .addCase(getAllBooks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.totalBooks = action.payload.totalBooks;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Book By ID
    builder
      .addCase(getBookById.pending, (state) => { state.loading = true; })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload.book;
      })
      .addCase(getBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Book
    builder
      .addCase(addBook.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.unshift(action.payload.book);
        state.message = action.payload.message;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Book
    builder
      .addCase(updateBook.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.map((book) =>
          book._id === action.payload.book._id ? action.payload.book : book
        );
        state.message = action.payload.message;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Book
    builder
      .addCase(deleteBook.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book._id !== action.payload.id);
        state.message = action.payload.message;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookState } = bookSlice.actions;
export default bookSlice.reducer;
