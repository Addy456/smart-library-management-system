import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  clearBookState,
} from "../../redux/slices/bookSlice";
import BookForm from "../../components/books/BookForm";
import BookCover from "../../components/books/BookCover";
import { BookQRCode } from "../../components/books/QRScanner";
import ConfirmModal from "../../components/common/ConfirmModal";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, BookOpen, Library } from "lucide-react";
import { PageHero, Section } from "../../components/ui";

const ManageBooks = () => {
  const dispatch = useDispatch();
  const { books, loading, error, message } = useSelector((state) => state.books);

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, bookId: null });

  useEffect(() => {
    dispatch(getAllBooks({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBookState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBookState());
      setShowModal(false);
      setEditingBook(null);
    }
  }, [error, message, dispatch]);

  const handleAdd = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setConfirm({ open: true, bookId: id });
  };

  const confirmDelete = async () => {
    const result = await dispatch(deleteBook(confirm.bookId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Book deleted successfully!");
    }
    setConfirm({ open: false, bookId: null });
  };

  const handleSubmit = (formData) => {
    if (editingBook) {
      dispatch(updateBook({ id: editingBook._id, bookData: formData }));
    } else {
      dispatch(addBook(formData));
    }
  };

  return (
    <div className="space-y-8">
      <PageHero
        variant="admin"
        size="sm"
        eyebrow={<><Library className="h-3.5 w-3.5" /> Library management</>}
        title="Manage books"
        subtitle={`${books.length} book${books.length !== 1 ? "s" : ""} in your catalog`}
        actions={
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-white/90 px-5 py-2.5 rounded-xl font-bold shadow-card transition-all"
          >
            <Plus className="w-4 h-4" /> Add book
          </button>
        }
      />

      <Section accent="primary" padding="sm">
        {/* Mobile + tablet card view (< xl) */}
        <div className="xl:hidden divide-y divide-gray-200 dark:divide-white/5">
          {books.map((book) => (
            <div key={book._id} className="py-4 flex items-start gap-3">
              <BookCover
                book={book}
                width={160}
                height={200}
                rounded="rounded-lg"
                className="w-14 h-16 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">{book.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">by {book.author}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">ISBN · {book.ISBN}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="whitespace-nowrap bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {book.category}
                  </span>
                  <span className={`whitespace-nowrap text-[11px] font-bold px-2 py-0.5 rounded-full border ${book.availableCopies > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"}`}>
                    {book.availableCopies > 0 ? `Available ${book.availableCopies}/${book.totalCopies}` : "Borrowed"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <BookQRCode book={book} />
                <button onClick={() => handleEdit(book)} className="text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 p-2 rounded-lg transition-colors" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(book._id)} className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {books.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="font-semibold">No books found</p>
              <p className="text-sm mt-1">Add your first book to get started</p>
            </div>
          )}
        </div>

        {/* Desktop table view (xl+) */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm">
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">Book</th>
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">Author</th>
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">Category</th>
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs hidden 2xl:table-cell">ISBN</th>
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-4 py-4 text-right font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-4 max-w-[340px]">
                    <div className="flex items-center gap-3">
                      <BookCover
                        book={book}
                        width={160}
                        height={200}
                        rounded="rounded-lg"
                        className="w-10 h-12 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">{book.title}</span>
                        <span className="2xl:hidden block text-xs text-gray-400 mt-0.5 truncate">ISBN · {book.ISBN}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[220px]">
                    <span className="line-clamp-2">{book.author}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="whitespace-nowrap inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 hidden 2xl:table-cell whitespace-nowrap">{book.ISBN}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`whitespace-nowrap inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${
                        book.availableCopies > 0
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                          : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
                      }`}
                    >
                      {book.availableCopies > 0 ? `Available ${book.availableCopies}/${book.totalCopies}` : "Borrowed"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <BookQRCode book={book} />
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 p-2 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No books found. Add your first book!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-surface-100 border border-gray-200 dark:border-white/10 shadow-hero w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-t-[24px] sm:rounded-[24px] safe-bottom">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                {editingBook ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingBook(null); }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <BookForm
              onSubmit={handleSubmit}
              initialData={editingBook}
              loading={loading}
            />
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirm.open}
        title="Delete Book"
        message="This action is permanent. Are you sure you want to delete this book?"
        variant="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ open: false, bookId: null })}
      />
    </div>
  );
};

export default ManageBooks;
