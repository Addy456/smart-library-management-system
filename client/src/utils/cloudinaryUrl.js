/**
 * Transform a Cloudinary URL to serve optimized images.
 * Applies auto-format (WebP/AVIF), auto-quality, and resize.
 *
 * @param {string} url - Original Cloudinary URL
 * @param {object} opts - Transform options
 * @param {number} opts.width - Target width (default: 400)
 * @param {number} opts.height - Target height (optional)
 * @param {string} opts.crop - Crop mode (default: "fill")
 * @returns {string} Optimized URL
 */
export function optimizedImg(url, { width = 400, height, crop = "fill" } = {}) {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  // Insert transforms after /upload/
  const transforms = [`f_auto`, `q_auto`, `w_${width}`, `c_${crop}`];
  if (height) transforms.push(`h_${height}`);

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}
