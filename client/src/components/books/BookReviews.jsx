import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookReviews, addReview, checkCanReview, clearReviewState } from "../../redux/slices/reviewSlice";
import toast from "react-hot-toast";
import { Star as FiStar } from "lucide-react";

/**
 * StarRating — supports three modes:
 *   1. interactive: click to set rating (whole stars)
 *   2. display: shows full stars only
 *   3. half-star: display mode with half-star precision (e.g. 3.5 → ★★★½☆)
 *
 * Props:
 *   rating     - number (0-5)
 *   interactive - boolean
 *   halfStar   - boolean (enable half-star display mode)
 *   onRate     - callback(star)
 *   size       - "sm" | "md" | "lg"
 */
const StarRating = ({ rating, interactive = false, halfStar = false, onRate, size = "md" }) => {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const activeRating = hovered || rating;

        // In half-star display mode, determine if this star is full, half, or empty
        let starClass = "text-gray-300";
        let fillClass = "";

        if (halfStar && !interactive) {
          if (star <= Math.floor(activeRating)) {
            // Full star
            starClass = "text-yellow-400";
            fillClass = "fill-yellow-400";
          } else if (star === Math.ceil(activeRating) && activeRating % 1 >= 0.25) {
            // Half star — use a gradient trick via clip-path
            starClass = "text-yellow-400";
            fillClass = "fill-yellow-400 half-star-clip";
          }
        } else {
          if (star <= activeRating) {
            starClass = "text-yellow-400";
            fillClass = "fill-yellow-400";
          }
        }

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`${sizeClass} transition-colors ${
              interactive ? "cursor-pointer" : "cursor-default"
            } ${starClass}`}
            aria-label={`${star} star`}
          >
            {halfStar && !interactive && star === Math.ceil(activeRating) && activeRating % 1 >= 0.25 && star > Math.floor(activeRating) ? (
              <span className="relative inline-block">
                {/* Gray background star */}
                <FiStar className="text-gray-300" />
                {/* Gold half overlay */}
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: "50%" }}
                >
                  <FiStar className="fill-yellow-400 text-yellow-400" />
                </span>
              </span>
            ) : (
              <FiStar className={fillClass} />
            )}
          </button>
        );
      })}
    </div>
  );
};

const BookReviews = ({ bookId }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { reviews, canReview, alreadyReviewed, loading } = useSelector(
    (state) => state.reviews
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(getBookReviews(bookId));
    if (isAuthenticated) {
      dispatch(checkCanReview(bookId));
    }
    return () => dispatch(clearReviewState());
  }, [dispatch, bookId, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }
    const result = await dispatch(addReview({ bookId, rating, comment }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      // Refresh book list ratings
      dispatch(getBookReviews(bookId));
    } else {
      toast.error(result.payload || "Failed to submit review");
    }
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Community Reviews
        {reviews.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500 inline-flex items-center gap-1.5">
            ({reviews.length} review{reviews.length !== 1 ? "s" : ""} ·{" "}
            <StarRating rating={avgRating} halfStar size="sm" />
            {avgRating.toFixed(1)})
          </span>
        )}
      </h3>

      {/* Review form for eligible users */}
      {isAuthenticated && canReview && (
        <form
          onSubmit={handleSubmit}
          className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-3 sm:p-4 mb-6 border border-indigo-100 dark:border-indigo-500/20"
        >
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
            Rate & Review this book
          </p>
          <StarRating rating={rating} interactive onRate={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts (optional)..."
            rows={3}
            maxLength={500}
            className="w-full mt-3 p-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-surface-200 text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}

      {isAuthenticated && alreadyReviewed && (
        <p className="text-sm text-green-600 mb-4 italic">
          ✓ You have already reviewed this book.
        </p>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm italic">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-surface-200 border border-gray-100 dark:border-white/10 rounded-xl p-3 sm:p-4 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                  {r.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {r.user?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={r.rating} halfStar size="sm" />
                </div>
              </div>
              {r.comment && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookReviews;
