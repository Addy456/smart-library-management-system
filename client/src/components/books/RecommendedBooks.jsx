import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendations } from "../../redux/slices/recommendationSlice";
import { issueBook } from "../../redux/slices/borrowSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen as FiBookOpen, Star as FiStar, ChevronLeft as FiChevronLeft, ChevronRight as FiChevronRight } from "lucide-react";
import { useRef } from "react";
import { optimizedImg } from "../../utils/cloudinaryUrl";
import BookCover from "./BookCover";

const RecommendedBooks = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { recommendations, favouriteCategories, loading } = useSelector(
    (state) => state.recommendations
  );
  const { loading: borrowLoading } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(getRecommendations());
  }, [dispatch]);

  const handleBorrow = async (bookId) => {
    const result = await dispatch(issueBook(bookId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Book borrowed successfully!");
      dispatch(getRecommendations());
    } else {
      toast.error(result.payload || "Failed to borrow book");
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse flex gap-4 overflow-hidden mt-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-[220px] h-64 bg-gray-100 rounded-xl flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <FiStar className="text-yellow-500 text-xl flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white truncate">
            Recommended for You
          </h2>
          {favouriteCategories.length > 0 && (
            <span className="text-sm text-gray-400 ml-2 hidden sm:inline">
              based on: {favouriteCategories.slice(0, 3).join(", ")}
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => scroll("left")}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            aria-label="Scroll left"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            aria-label="Scroll right"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {recommendations.map((book) => (
          <div
            key={book._id}
            className="min-w-[180px] sm:min-w-[220px] max-w-[180px] sm:max-w-[220px] bg-white dark:bg-surface-200 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-md transition-shadow flex-shrink-0 relative"
          >
            {/* Match % badge */}
            {book.matchScore > 0 && (
              <div className="absolute top-2 right-2 z-10 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                {book.matchScore}% match
              </div>
            )}

            <Link to={`/books/${book._id}`}>
              <BookCover
                book={book}
                width={440}
                height={256}
                rounded="rounded-none"
                className="h-32"
              />
            </Link>

            <div className="p-3">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {book.category}
              </span>
              <h4 className="text-sm font-bold text-gray-800 dark:text-white leading-tight mt-0.5 line-clamp-2">
                <Link to={`/books/${book._id}`} className="hover:text-indigo-600">
                  {book.title}
                </Link>
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">by {book.author}</p>

              {book.averageRating > 0 && (
                <p className="text-xs text-yellow-500 mt-0.5">
                  ★ {book.averageRating.toFixed(1)}
                </p>
              )}

              {/* "Why recommended" label */}
              {book.whyRecommended && (
                <p className="text-[10px] text-purple-500 mt-1 italic leading-tight line-clamp-2">
                  💡 {book.whyRecommended}
                </p>
              )}

              {book.availableCopies > 0 && (
                <button
                  onClick={() => handleBorrow(book._id)}
                  disabled={borrowLoading}
                  className="mt-2 w-full bg-indigo-600 text-white text-xs py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Borrow
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedBooks;
