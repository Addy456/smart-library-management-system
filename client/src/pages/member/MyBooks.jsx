import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyRecords,
  returnBook,
  clearBorrowState,
} from "../../redux/slices/borrowSlice";
import { getMyWaitlist, leaveWaitlist } from "../../redux/slices/waitlistSlice";
import BorrowCard from "../../components/borrow/BorrowCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import toast from "react-hot-toast";
import PageSkeleton from "../../components/common/PageSkeleton";
import { Link } from "react-router-dom";
import { Clock, Trash2, BookOpen, History, Library } from "lucide-react";
import { PageHero, Section } from "../../components/ui";

const MyBooks = () => {
  const dispatch = useDispatch();
  const { myRecords, loading, error, message } = useSelector((state) => state.borrow);
  const { myWaitlist } = useSelector((state) => state.waitlist);
  const [confirm, setConfirm] = useState({ open: false, borrowId: null });

  useEffect(() => {
    dispatch(getMyRecords());
    dispatch(getMyWaitlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBorrowState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBorrowState());
      dispatch(getMyRecords());
    }
  }, [error, message, dispatch]);

  const handleReturn = async (borrowId) => {
    setConfirm({ open: true, borrowId });
  };

  const confirmReturn = async () => {
    const result = await dispatch(returnBook(confirm.borrowId));
    if (result.meta.requestStatus === "fulfilled") {
      const fine = result.payload.fine;
      if (fine > 0) {
        toast.success(`Book returned! A fine of ₹${fine} has been charged.`);
      } else {
        toast.success("Book returned successfully! No fine charged.");
      }
    }
    setConfirm({ open: false, borrowId: null });
  };

  const handleLeaveWaitlist = async (bookId) => {
    const result = await dispatch(leaveWaitlist(bookId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Removed from waitlist");
      dispatch(getMyWaitlist());
    } else {
      toast.error(result.payload || "Failed to leave waitlist");
    }
  };

  const pendingRequests = myRecords.filter((r) => r.status === "pending");
  const activeBorrows = myRecords.filter((r) => r.status === "borrowed");
  const rejectedRecords = myRecords.filter((r) => r.status === "rejected");
  const returnedBooks = myRecords.filter((r) => r.status === "returned");

  if (loading) return <PageSkeleton variant="cards" />;

  const counter = (n) => (
    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 text-xs font-bold">
      {n}
    </span>
  );

  return (
    <div className="space-y-8">
      <PageHero
        variant="member"
        size="sm"
        eyebrow={<><BookOpen className="h-3.5 w-3.5" /> Your shelf</>}
        title={<>My books 📚</>}
        subtitle={`${activeBorrows.length} active · ${returnedBooks.length} returned · ${myWaitlist.length} on waitlist`}
        actions={
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-gray-50 px-5 py-2.5 rounded-2xl font-bold shadow-card transition-colors"
          >
            <Library className="h-4 w-4" /> Browse catalog
          </Link>
        }
      />

      {pendingRequests.length > 0 && (
        <Section accent="warning" title="Pending requests" action={counter(pendingRequests.length)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((record) => (
              <BorrowCard key={record._id} record={record} />
            ))}
          </div>
        </Section>
      )}

      <Section accent="primary" title="Currently borrowed" action={counter(activeBorrows.length)}>
        {activeBorrows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBorrows.map((record) => (
              <BorrowCard key={record._id} record={record} onReturn={handleReturn} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 font-semibold">No books currently borrowed</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse the catalog to find your next read</p>
            <Link to="/catalog" className="inline-block mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors">
              Browse Catalog &rarr;
            </Link>
          </div>
        )}
      </Section>

      {myWaitlist.length > 0 && (
        <Section
          accent="warning"
          title={<span className="inline-flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> My waitlist</span>}
          action={counter(myWaitlist.length)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myWaitlist.map((entry) => (
              <div
                key={entry._id}
                className="rounded-2xl p-4 bg-gray-50 dark:bg-surface-200 border border-amber-200/60 dark:border-amber-500/20 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/books/${entry.book?._id}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-sm line-clamp-2 transition-colors"
                  >
                    {entry.book?.title}
                  </Link>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    by {entry.book?.author}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
                    Queue position: #{entry.position}
                  </p>
                </div>
                <button
                  onClick={() => handleLeaveWaitlist(entry.book?._id)}
                  className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 flex-shrink-0 transition-colors p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  title="Leave waitlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {rejectedRecords.length > 0 && (
        <Section accent="danger" title="Rejected requests" action={counter(rejectedRecords.length)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rejectedRecords.map((record) => (
              <BorrowCard key={record._id} record={record} />
            ))}
          </div>
        </Section>
      )}

      <Section
        accent="secondary"
        title={<span className="inline-flex items-center gap-2"><History className="w-5 h-5 text-emerald-500" /> Return history</span>}
        action={counter(returnedBooks.length)}
      >
        {returnedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {returnedBooks.map((record) => (
              <BorrowCard key={record._id} record={record} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <History className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 font-semibold">No return history yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Books you return will appear here</p>
          </div>
        )}
      </Section>

      <ConfirmModal
        isOpen={confirm.open}
        title="Return Book"
        message="Are you sure you want to return this book? Any overdue fines will be calculated automatically."
        variant="warning"
        confirmText="Return"
        onConfirm={confirmReturn}
        onCancel={() => setConfirm({ open: false, borrowId: null })}
      />
    </div>
  );
};

export default MyBooks;

