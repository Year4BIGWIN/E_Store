/**
 * Optimize Cloudinary image URLs for better performance
 * Adds WebP format, quality optimization, and responsive sizing
 * 
 * @param {string} url - Original Cloudinary image URL
 * @param {object} options - Optimization options
 * @returns {string} - Optimized Cloudinary URL
 */
export function optimizeCloudinaryImage(url, options = {}) {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width = 'auto',
    quality = 'auto:good',
    format = 'webp',
    fetchFormat = 'auto'
  } = options;

  // Cloudinary transformation parameters
  const transformations = [
    `w_${width}`,           // Responsive width
    `q_${quality}`,         // Quality optimization
    `f_${format}`,          // WebP format
    `fl_progressive`,       // Progressive loading
    `dpr_auto`,            // Auto device pixel ratio
  ].join(',');

  // Insert transformations into Cloudinary URL
  // Format: https://res.cloudinary.com/{cloud}/image/upload/{transformations}/{path}
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }

  return url;
}

/**
 * Get optimized image URL for product cards
 * @param {string} url - Original image URL
 * @returns {string} - Optimized URL
 */
export function getProductCardImage(url) {
  return optimizeCloudinaryImage(url, {
    width: 400,
    quality: 'auto:good',
    format: 'webp'
  });
}

/**
 * Get optimized image URL for product detail pages
 * @param {string} url - Original image URL
 * @returns {string} - Optimized URL
 */
export function getProductDetailImage(url) {
  return optimizeCloudinaryImage(url, {
    width: 800,
    quality: 'auto:best',
    format: 'webp'
  });
}
