/**
 * Optimize Cloudinary image URLs for better performance
 * Adds automatic format selection (WebP/AVIF), quality optimization, and responsive sizing
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
    height = null,
    quality = 'auto:good',
    crop = 'limit'  // Prevent upscaling beyond original dimensions
  } = options;

  // Cloudinary transformation parameters
  const transformations = [
    `w_${width}`,           // Responsive width
    height ? `h_${height}` : null,  // Optional height
    `c_${crop}`,            // Crop mode (limit prevents upscaling)
    `q_${quality}`,         // Quality optimization
    `f_auto`,               // Automatic format (WebP/AVIF based on browser support)
    `fl_progressive`,       // Progressive loading
    `dpr_auto`,             // Auto device pixel ratio
  ].filter(Boolean).join(',');

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
    quality: 'auto:good'
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
    quality: 'auto:best'
  });
}

/**
 * Get optimized image URL for carousel/banner images
 * @param {string} url - Original image URL
 * @param {string} size - 'mobile' or 'desktop'
 * @returns {string} - Optimized URL
 */
export function getCarouselImage(url, size = 'desktop') {
  const dimensions = size === 'mobile' 
    ? { width: 375, height: 250 }
    : { width: 1920, height: 450 };
  
  return optimizeCloudinaryImage(url, {
    ...dimensions,
    quality: 'auto:good',
    crop: 'fill'  // Fill the dimensions while maintaining aspect ratio
  });
}
