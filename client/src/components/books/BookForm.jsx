import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Form for adding or editing a book
const BookForm = ({ onSubmit, initialData = null, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    ISBN: "",
    description: "",
    totalCopies: 1,
    coverImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        author: initialData.author || "",
        category: initialData.category || "",
        ISBN: initialData.ISBN || "",
        description: initialData.description || "",
        totalCopies: initialData.totalCopies || 1,
        coverImage: null,
      });
      setImagePreview(initialData.coverImage || null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    if (e.target.name === "coverImage") {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size must be less than 5MB");
          e.target.value = "";
          return;
        }
        setFormData({ ...formData, coverImage: file });
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-surface-200 text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter book title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-surface-200 text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter author name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-surface-200 text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Fiction, Science, History"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN *</label>
          <input
            type="text"
            name="ISBN"
            value={formData.ISBN}
            onChange={handleChange}
            required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-surface-200 text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter ISBN"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Copies *</label>
        <input
          type="number"
          name="totalCopies"
          value={formData.totalCopies}
          onChange={handleChange}
          min="1"
          required
          className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-surface-200 text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Number of copies"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-surface-200 text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter book description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image</label>
        <input
          type="file"
          name="coverImage"
          onChange={handleChange}
          accept="image/*"
          className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 dark:file:bg-indigo-500/10 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-500/20"
        />
        <p className="text-xs text-gray-400 mt-1">Max 5MB. JPG, PNG, or WebP.</p>
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="Preview" className="w-20 h-24 object-cover rounded border border-gray-200 dark:border-white/10" />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all font-medium disabled:opacity-50"
      >
        {loading ? "Saving..." : initialData ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
};

export default BookForm;
