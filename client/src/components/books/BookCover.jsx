import { useMemo, useState } from "react";
import { BookOpen as FiBookOpen } from "lucide-react";
import { optimizedImg } from "../../utils/cloudinaryUrl";

/**
 * Build an ordered chain of HD cover-image candidates for a book.
 * 1. Stored Cloudinary/remote image (optimised + raw).
 * 2. Open Library Covers API by ISBN (-L = ~500px HD).
 * 3. Google Books thumbnail endpoint by ISBN.
 * The <BookCover/> component walks this list via onError until one loads.
 */
export const buildCoverSources = (book, { width = 600, height = 400 } = {}) => {
  const sources = [];
  if (book?.coverImage) {
    sources.push(optimizedImg(book.coverImage, { width, height }));
    if (!sources.includes(book.coverImage)) sources.push(book.coverImage);
  }
  const isbn = (book?.ISBN || "").replace(/[-\s]/g, "");
  if (isbn) {
    sources.push(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`);
    sources.push(`https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1&source=gbs_api`);
  }
  return sources;
};

/**
 * Resilient book cover image: swaps through fallback URLs on error,
 * shows a skeleton while loading, final fallback = book icon.
 */
const BookCover = ({
  book,
  width = 600,
  height = 400,
  className = "",
  imgClassName = "",
  rounded = "rounded-xl",
}) => {
  const sources = useMemo(() => buildCoverSources(book, { width, height }), [book, width, height]);
  const [srcIdx, setSrcIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const src = sources[srcIdx];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-blue-50 dark:from-indigo-900/30 dark:via-violet-900/30 dark:to-blue-900/30 ${rounded} ${className}`}>
      {src ? (
        <>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FiBookOpen className="text-4xl text-indigo-300 animate-pulse" />
            </div>
          )}
          <img
            src={src}
            alt={book?.title || "Book cover"}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(false);
              setSrcIdx((i) => (i + 1 < sources.length ? i + 1 : i));
            }}
            className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
          />
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <FiBookOpen className="text-4xl text-indigo-400" />
        </div>
      )}
    </div>
  );
};

export default BookCover;
