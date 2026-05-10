import EmptyState from "../common/EmptyState";
import { ClipboardList, BookOpen, User, Calendar, CalendarClock, IndianRupee } from "lucide-react";
import { Badge, Button } from "../ui";
import { cn } from "../ui/cn";

/**
 * BorrowTable — modern card-row layout (replaces classic <table>).
 * Each record renders as a rounded card with hover lift, Badge for status,
 * and design-system Button actions. Works at every breakpoint (wraps gracefully).
 */
const BorrowTable = ({ records, onReturn, onApprove, onReject, showUser = true, isAdmin: _isAdmin = false }) => {
  const formatDate = (date) => (date ? new Date(date).toLocaleDateString("en-IN") : "N/A");
  const isOverdue = (returnDate, status) =>
    status === "borrowed" && new Date(returnDate) < new Date();

  const statusMeta = (record) => {
    if (record.status === "returned")  return { tone: "success", label: "Returned" };
    if (record.status === "pending")   return { tone: "warning", label: "Pending Approval" };
    if (record.status === "rejected")  return { tone: "danger",  label: "Rejected" };
    if (isOverdue(record.returnDate, record.status)) return { tone: "danger", label: "Overdue" };
    return { tone: "info", label: "Borrowed" };
  };

  if (records.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No records found"
        description="There are no borrow records matching this filter."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {records.map((record) => {
        const s = statusMeta(record);
        const overdue = isOverdue(record.returnDate, record.status);
        return (
          <li
            key={record._id}
            className={cn(
              "group relative rounded-3xl p-4 sm:p-5",
              "bg-white dark:bg-surface-200",
              "border border-gray-200/70 dark:border-white/10",
              "shadow-card transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary-200 dark:hover:border-primary-500/30 motion-reduce:transform-none"
            )}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Book */}
              <div className="flex items-center gap-3 min-w-0 lg:w-[30%]">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white grid place-items-center shrink-0 shadow-card">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {record.book?.title || "—"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {record.book?.author || "Unknown author"}
                  </p>
                </div>
              </div>

              {/* User */}
              {showUser && (
                <div className="flex items-center gap-2 min-w-0 lg:w-[22%]">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {record.user?.name || "—"}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {record.user?.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs lg:flex-1">
                <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" /> Issued {formatDate(record.issueDate)}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5",
                    overdue
                      ? "text-danger-600 dark:text-danger-400 font-semibold"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <CalendarClock className="h-3.5 w-3.5" /> Due {formatDate(record.returnDate)}
                </span>
                {record.fine > 0 && (
                  <span className="inline-flex items-center gap-1 text-danger-600 dark:text-danger-400 font-semibold">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {record.fine}
                  </span>
                )}
              </div>

              {/* Status + actions */}
              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <Badge tone={s.tone} size="md">{s.label}</Badge>
                <div className="flex gap-2 flex-wrap">
                  {record.status === "pending" && onApprove && (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => onApprove(record._id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onReject(record._id)}>
                        Reject
                      </Button>
                    </>
                  )}
                  {record.status === "borrowed" && onReturn && (
                    <Button size="sm" variant="secondary" onClick={() => onReturn(record._id)}>
                      Return
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BorrowTable;
