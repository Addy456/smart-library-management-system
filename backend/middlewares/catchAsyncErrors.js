// Wrapper to catch async errors and pass them to the error handler middleware
// This eliminates the need for try-catch blocks in every controller
const catchAsyncErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsyncErrors;
