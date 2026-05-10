import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRecords, getOverdueRecords } from "../../redux/slices/borrowSlice";
import { getAllBooks } from "../../redux/slices/bookSlice";
import { getAllUsers } from "../../redux/slices/userSlice";
import { TrendingUp, DollarSign, BookOpen, Users, BarChart3 } from "lucide-react";
import { PageHero, Section } from "../../components/ui";

const Reports = () => {
  const dispatch = useDispatch();
  const { records, overdueRecords } = useSelector((state) => state.borrow);
  const { books, totalBooks } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getAllRecords());
    dispatch(getOverdueRecords());
    dispatch(getAllBooks({}));
    dispatch(getAllUsers());
  }, [dispatch]);

  // Calculate total fine collected
  const totalFineCollected = records
    .filter((r) => r.status === "returned" && r.fine > 0)
    .reduce((sum, r) => sum + r.fine, 0);

  // Calculate pending fines (overdue but not yet returned)
  const pendingFines = overdueRecords.reduce((sum, r) => {
    const today = new Date();
    const overdueDays = Math.ceil(
      (today - new Date(r.returnDate)) / (24 * 60 * 60 * 1000)
    );
    return sum + overdueDays * 5;
  }, 0);

  // Most borrowed books - count occurrences
  const borrowCounts = {};
  records.forEach((r) => {
    if (r.book?._id) {
      borrowCounts[r.book._id] = {
        title: r.book.title,
        author: r.book.author,
        count: (borrowCounts[r.book._id]?.count || 0) + 1,
      };
    }
  });
  const mostBorrowed = Object.values(borrowCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const summaryStats = [
    { title: "Total Books", value: totalBooks || books.length, icon: <BookOpen className="w-5 h-5" />, gradient: "from-indigo-500 to-violet-600" },
    { title: "Total Members", value: users.length, icon: <Users className="w-5 h-5" />, gradient: "from-emerald-500 to-teal-600" },
    { title: "Total Borrows", value: records.length, icon: <TrendingUp className="w-5 h-5" />, gradient: "from-sky-500 to-cyan-600" },
    { title: "Fine Collected", value: `₹${totalFineCollected}`, icon: <DollarSign className="w-5 h-5" />, gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <PageHero
        variant="admin"
        size="sm"
        eyebrow={<><BarChart3 className="h-3.5 w-3.5" /> Insights</>}
        title="Reports & analytics"
        subtitle="Your library's performance at a glance"
      />

      <Section accent="primary" title="Summary" eyebrow="Key metrics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {summaryStats.map((stat, index) => (
            <div key={index} className="rounded-2xl p-4 sm:p-5 bg-gray-50 dark:bg-surface-200 border border-gray-200 dark:border-white/10 hover:shadow-card transition-all">
              <div className={`bg-gradient-to-br ${stat.gradient} text-white inline-flex p-2.5 rounded-xl mb-3 shadow-card`}>
                {stat.icon}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">{stat.title}</p>
              <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section accent="success" title="Fine summary">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl">
              <div>
                <p className="font-bold text-emerald-700 dark:text-emerald-300">Total fine collected</p>
                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/70">From returned books</p>
              </div>
              <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">₹{totalFineCollected}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl">
              <div>
                <p className="font-bold text-rose-700 dark:text-rose-300">Pending fines</p>
                <p className="text-sm text-rose-600/80 dark:text-rose-400/70">From {overdueRecords.length} overdue books</p>
              </div>
              <span className="text-xl font-extrabold text-rose-700 dark:text-rose-300">₹{pendingFines}</span>
            </div>
          </div>
        </Section>

        <Section accent="accent" title="Most borrowed books">
          {mostBorrowed.length > 0 ? (
            <div className="space-y-1">
              {mostBorrowed.map((book, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg w-7 shrink-0">#{index + 1}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{book.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{book.author}</p>
                    </div>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                    {book.count}x
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">No borrow data available</p>
          )}
        </Section>
      </div>
    </div>
  );
};

export default Reports;
