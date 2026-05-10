// Shimmer skeleton loader for page-level loading states
const shimmer = "animate-pulse bg-gray-200 dark:bg-white/5 rounded-xl";

const PageSkeleton = ({ variant = "default" }) => {
  if (variant === "dashboard") {
    return (
      <div className="min-h-screen pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className={`${shimmer} h-28 w-full`} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${shimmer} h-24`} />
            ))}
          </div>
          <div className={`${shimmer} h-64`} />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="space-y-4 p-6">
        <div className="flex justify-between items-center">
          <div className={`${shimmer} h-8 w-48`} />
          <div className={`${shimmer} h-10 w-32`} />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`${shimmer} h-16`} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="min-h-screen pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className={`${shimmer} h-8 w-56`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`${shimmer} h-72`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default full-page skeleton
  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className={`${shimmer} h-10 w-64`} />
        <div className={`${shimmer} h-4 w-96 max-w-full`} />
        <div className={`${shimmer} h-64 w-full`} />
        <div className="grid grid-cols-2 gap-4">
          <div className={`${shimmer} h-20`} />
          <div className={`${shimmer} h-20`} />
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
