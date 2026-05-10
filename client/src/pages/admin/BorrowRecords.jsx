import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRecords,
  getOverdueRecords,
  returnBook,
  approveRequest,
  rejectRequest,
  clearBorrowState,
  fetchAllRecordsIfNeeded,
  fetchOverdueIfNeeded,
  invalidateBorrowCache,
} from "../../redux/slices/borrowSlice";
import BorrowTable from "../../components/borrow/BorrowTable";
import toast from "react-hot-toast";
import { ClipboardList } from "lucide-react";
import { PageHero, Section } from "../../components/ui";

const BorrowRecords = () => {
  const dispatch = useDispatch();
  const { records, overdueRecords, loading, error, message } = useSelector(
    (state) => state.borrow
  );
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllRecordsIfNeeded());
    dispatch(fetchOverdueIfNeeded());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBorrowState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBorrowState());
    }
  }, [error, message, dispatch]);

  const handleReturn = useCallback(async (borrowId) => {
    const result = await dispatch(returnBook(borrowId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(`Book returned! Fine: ₹${result.payload.fine}`);
      dispatch(getAllRecords());
      dispatch(getOverdueRecords());
    }
  }, [dispatch]);

  const handleApprove = useCallback(async (borrowId) => {
    const result = await dispatch(approveRequest(borrowId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Borrow request approved!");
      dispatch(getAllRecords());
    }
  }, [dispatch]);

  const handleReject = useCallback(async (borrowId) => {
    const result = await dispatch(rejectRequest(borrowId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Borrow request rejected");
      dispatch(getAllRecords());
    }
  }, [dispatch]);

  // Memoize filtered records to avoid recalculating on every render
  const filteredRecords = useMemo(() => {
    const today = new Date();
    switch (filter) {
      case "pending":
        return records.filter((r) => r.status === "pending");
      case "borrowed":
        return records.filter((r) => r.status === "borrowed");
      case "returned":
        return records.filter((r) => r.status === "returned");
      case "rejected":
        return records.filter((r) => r.status === "rejected");
      case "overdue":
        return records.filter(
          (r) => r.status === "borrowed" && new Date(r.returnDate) < today
        );
      default:
        return records;
    }
  }, [records, filter]);

  // Memoize tab counts
  const tabCounts = useMemo(() => ({
    all: records.length,
    pending: records.filter((r) => r.status === "pending").length,
    borrowed: records.filter((r) => r.status === "borrowed").length,
    returned: records.filter((r) => r.status === "returned").length,
    rejected: records.filter((r) => r.status === "rejected").length,
    overdue: overdueRecords.length,
  }), [records, overdueRecords]);

  return (
    <div className="space-y-8">
      <PageHero
        variant="admin"
        size="sm"
        eyebrow={<><ClipboardList className="h-3.5 w-3.5" /> Borrow operations</>}
        title="Borrow records"
        subtitle={`${tabCounts.pending} pending · ${tabCounts.borrowed} active · ${tabCounts.overdue} overdue`}
      />

      <Section
        accent="primary"
        eyebrow="Filter"
        title="All records"
      >
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
          {[
            { key: "all", label: `All (${tabCounts.all})` },
            { key: "pending", label: `Pending (${tabCounts.pending})`, warn: true },
            { key: "borrowed", label: `Borrowed (${tabCounts.borrowed})` },
            { key: "returned", label: `Returned (${tabCounts.returned})` },
            { key: "rejected", label: `Rejected (${tabCounts.rejected})` },
            { key: "overdue", label: `Overdue (${tabCounts.overdue})`, danger: true },
          ].map((tab) => {
            const active = filter === tab.key;
            const base = "px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 border";
            let cls;
            if (active) {
              cls = tab.danger
                ? "bg-rose-600 text-white border-rose-600 shadow-card"
                : tab.warn
                ? "bg-amber-500 text-white border-amber-500 shadow-card"
                : "bg-indigo-600 text-white border-indigo-600 shadow-card";
            } else {
              cls = tab.danger
                ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30"
                : tab.warn
                ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/10";
            }
            return (
              <button key={tab.key} onClick={() => setFilter(tab.key)} className={`${base} ${cls}`}>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Borrow Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <BorrowTable
            records={filteredRecords}
            onReturn={handleReturn}
            onApprove={handleApprove}
            onReject={handleReject}
            showUser={true}
            isAdmin={true}
          />
        )}
      </Section>
    </div>
  );
};

export default BorrowRecords;
