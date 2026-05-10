import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "../redux/slices/bookSlice";
import BookList from "../components/books/BookList";
import { motion } from "framer-motion";
import { Search, Library, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { PageHero, Section } from "../components/ui";

const Catalog = () => {
  const dispatch = useDispatch();
  const { books, loading, totalBooks, totalPages, currentPage } = useSelector(
    (state) => state.books
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debounceRef = useRef(null);
  const debouncedSearch = useCallback((value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      dispatch(getAllBooks({ search: value, page: 1 }));
    }, 400);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllBooks({ search, page }));
  }, [dispatch, page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHero
        variant="public"
        eyebrow={<><Library className="h-3.5 w-3.5" /> Book collection</>}
        title={<>Find your next <span className="italic">great</span> read ✨</>}
        subtitle={`Browse ${totalBooks || "our"} curated books — search by title, author, or category.`}
      >
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by title, author, or category…"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/15 backdrop-blur border border-white/25 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 focus:bg-white/20 transition-all text-base"
          />
        </div>
      </PageHero>

      <Section
        accent="primary"
        title="Catalog"
        description={loading ? "Loading books…" : `${books?.length || 0} books on this page`}
        action={
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Page {currentPage} / {totalPages || 1}
          </span>
        }
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <BookList books={books} loading={loading} />
        </motion.div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 flex-wrap px-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-surface-200 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-surface-100 hover:border-indigo-200 dark:hover:border-indigo-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {(() => {
              const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
              const maxVisible = typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 7;
              let visible = pages;
              if (totalPages > maxVisible) {
                const half = Math.floor(maxVisible / 2);
                let start = Math.max(1, currentPage - half);
                let end = start + maxVisible - 1;
                if (end > totalPages) {
                  end = totalPages;
                  start = Math.max(1, end - maxVisible + 1);
                }
                visible = pages.slice(start - 1, end);
              }
              return visible.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[40px] px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    p === currentPage
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-card"
                      : "border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-surface-200 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-surface-100 hover:border-indigo-200 dark:hover:border-indigo-500/40"
                  }`}
                >
                  {p}
                </button>
              ));
            })()}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-surface-200 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-surface-100 hover:border-indigo-200 dark:hover:border-indigo-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Section>
    </div>
  );
};

export default Catalog;
