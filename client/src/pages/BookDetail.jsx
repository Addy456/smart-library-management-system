import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBookById } from "../redux/slices/bookSlice";
import { issueBook } from "../redux/slices/borrowSlice";
import BookReviews from "../components/books/BookReviews";
import { BookQRCode } from "../components/books/QRScanner";
import WaitlistButton from "../components/books/WaitlistButton";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Star, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import PageSkeleton from "../components/common/PageSkeleton";
import BookCover from "../components/books/BookCover";
import { PageHero, Section } from "../components/ui";

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { book, loading } = useSelector((state) => state.books);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading: borrowLoading } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(getBookById(id));
  }, [dispatch, id]);

  const handleBorrow = async () => {
    const result = await dispatch(issueBook(book._id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Borrow request submitted! Waiting for admin approval.");
      dispatch(getBookById(id));
    } else {
      toast.error(result.payload || "Failed to submit borrow request");
    }
  };

  if (loading) return <PageSkeleton />;
  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to catalog
      </Link>

      <PageHero
        variant="public"
        size="sm"
        eyebrow={<><BookOpen className="h-3.5 w-3.5" /> {book.category}</>}
        title={book.title}
        subtitle={<>by <span className="font-semibold">{book.author}</span></>}
        badges={
          book.totalReviews > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1.5 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              {book.averageRating?.toFixed(1)}
              <span className="opacity-80">({book.totalReviews})</span>
            </div>
          )
        }
      />

      <Section accent="primary" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-1">
            <BookCover
              book={book}
              width={800}
              height={1000}
              rounded="rounded-2xl"
              className="w-full aspect-[3/4] shadow-card"
            />
          </div>

          <div className="md:col-span-2 space-y-5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 mb-1">
                ISBN · {book.ISBN}
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                About this book
              </h2>
            </div>

            {book.description && (
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                {book.description}
              </p>
            )}

            <div className="flex items-center gap-3 flex-wrap pt-2">
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-bold px-3.5 py-2 rounded-full border-2 ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                    : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
                }`}
              >
                {isAvailable ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {isAvailable
                  ? `Available (${book.availableCopies}/${book.totalCopies})`
                  : "Not available"}
              </span>

              {isAvailable && (
                isAuthenticated && user?.role === "member" ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBorrow}
                    disabled={borrowLoading}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all disabled:opacity-50 font-bold shadow-card"
                  >
                    {borrowLoading ? "Processing…" : "Request Borrow"}
                  </motion.button>
                ) : !isAuthenticated ? (
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all font-bold shadow-card"
                  >
                    Login to Borrow
                  </Link>
                ) : null
              )}

              <WaitlistButton bookId={book._id} isAvailable={isAvailable} />

              {isAuthenticated && user?.role === "admin" && (
                <BookQRCode book={book} />
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section accent="accent" padding="lg">
        <BookReviews bookId={book._id} />
      </Section>
    </div>
  );
};

export default BookDetail;
