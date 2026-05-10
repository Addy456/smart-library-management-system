// Centered loading spinner component
const Loader = () => {
  return (
    <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-white dark:bg-surface-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-violet-600"></div>
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;
