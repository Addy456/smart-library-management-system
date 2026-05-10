// Card displaying a single borrow record
const BorrowCard = ({ record, onReturn }) => {
  const isOverdue =
    record.status === "borrowed" && new Date(record.returnDate) < new Date();

  return (
    <div className="bg-white dark:bg-surface-200 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-4 sm:p-5">
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-800 dark:text-white truncate">{record.book?.title}</h3>
          <p className="text-sm text-gray-500 truncate">by {record.book?.author}</p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            record.status === "returned"
              ? "bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400"
              : record.status === "pending"
              ? "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
              : record.status === "rejected"
              ? "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
              : isOverdue
              ? "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
              : "bg-blue-100 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400"
          }`}
        >
          {record.status === "returned"
            ? "Returned"
            : record.status === "pending"
            ? "Pending Approval"
            : record.status === "rejected"
            ? "Rejected"
            : isOverdue
            ? "Overdue"
            : "Borrowed"}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <p>
          <span className="font-medium">Issued:</span>{" "}
          {new Date(record.issueDate).toLocaleDateString("en-IN")}
        </p>
        <p>
          <span className="font-medium">Due:</span>{" "}
          <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
            {new Date(record.returnDate).toLocaleDateString("en-IN")}
          </span>
        </p>
        {record.fine > 0 && (
          <p className="text-red-600 font-medium">Fine: ₹{record.fine}</p>
        )}
      </div>

      {record.status === "borrowed" && onReturn && (
        <button
          onClick={() => onReturn(record._id)}
          className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Return Book
        </button>
      )}
    </div>
  );
};

export default BorrowCard;
