import BookCard from "./BookCard";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import { BookOpen } from "lucide-react";

// Grid display of books
const BookList = ({ books, loading }) => {
  if (loading) {
    return <Loader />;
  }

  if (!books || books.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No books found"
        description="Try adjusting your search or filters to find what you're looking for."
        actionLabel="Browse Catalog"
        actionTo="/catalog"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
