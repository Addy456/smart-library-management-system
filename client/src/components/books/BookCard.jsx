import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { issueBook } from "../../redux/slices/borrowSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Star, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { BookQRCode } from "./QRScanner";
import WaitlistButton from "./WaitlistButton";
import BookCover from "./BookCover";

// Individual book display card
const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.borrow);

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to borrow books");
      navigate("/login");
      return;
    }
    const result = await dispatch(issueBook(book._id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Borrow request submitted! Waiting for admin approval.");
    } else {
      toast.error(result.payload || "Failed to submit borrow request");
    }
  };

  const isAvailable = book.availableCopies > 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative flex flex-col bg-white dark:bg-surface-200 rounded-[22px] border border-gray-200 dark:border-white/10 shadow-card hover:shadow-hero transition-shadow overflow-hidden"
    >
      {/* Cover */}
      <Link to={`/books/${book._id}`} className="relative block overflow-hidden">
        <BookCover
          book={book}
          width={600}
          height={400}
          rounded="rounded-none"
          className="h-52 sm:h-56"
          imgClassName="group-hover:scale-[1.06] transition-transform duration-500 ease-out"
        />
        {/* gradient veil */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Rating pill */}
        {book.totalReviews > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-card text-xs font-bold text-gray-900">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {book.averageRating?.toFixed(1)}
            <span className="text-gray-500 font-semibold">({book.totalReviews})</span>
          </div>
        )}

        {/* Availability pill */}
        <div
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-card ${
            isAvailable
              ? "bg-emerald-500 text-white"
              : "bg-rose-500 text-white"
          }`}
        >
          {isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {isAvailable ? `${book.availableCopies}/${book.totalCopies}` : "Borrowed"}
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category */}
        <span className="inline-block self-start bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 border border-indigo-100 dark:border-indigo-500/30">
          {book.category}
        </span>

        <h3 className="font-heading font-extrabold text-gray-900 dark:text-white text-base sm:text-lg leading-snug mb-1 line-clamp-2">
          <Link to={`/books/${book._id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {book.title}
          </Link>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">by {book.author}</p>

        {/* ISBN */}
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mb-4 truncate">ISBN · {book.ISBN}</p>

        {/* CTA row */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-white/10">
          {isAvailable ? (
            isAuthenticated && user?.role === "member" ? (
              <button
                onClick={handleBorrow}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-4 py-2.5 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all font-bold shadow-card disabled:opacity-50"
              >
                {loading ? "Requesting…" : (<>Borrow <ArrowRight className="w-3.5 h-3.5" /></>)}
              </button>
            ) : !isAuthenticated ? (
              <Link
                to="/login"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-4 py-2.5 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all font-bold shadow-card"
              >
                Login to Borrow
              </Link>
            ) : (
              <Link
                to={`/books/${book._id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-sm px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
              >
                View details
              </Link>
            )
          ) : (
            <WaitlistButton bookId={book._id} isAvailable={isAvailable} />
          )}
        </div>

        {/* QR code for admins */}
        {isAuthenticated && user?.role === "admin" && (
          <div className="mt-3">
            <BookQRCode book={book} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;
