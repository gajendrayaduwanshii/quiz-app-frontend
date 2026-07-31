import { useState, useEffect, useCallback } from 'react';

// Image optimization utilities
export const useImageOptimization = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    quality = 80,
    width,
    height,
    format = 'webp',
    lazy = true,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4='
  } = options;

  const optimizeImage = useCallback(async (imageSrc) => {
    if (!imageSrc) return;

    try {
      setLoading(true);
      setError(null);

      // Create optimized image URL
      const optimizedSrc = createOptimizedImageUrl(imageSrc, {
        quality,
        width,
        height,
        format
      });

      // Preload image
      const img = new Image();
      img.onload = () => {
        setImageSrc(optimizedSrc);
        setLoading(false);
      };
      img.onerror = () => {
        setError('Failed to load image');
        setLoading(false);
      };
      img.src = optimizedSrc;

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [quality, width, height, format]);

  useEffect(() => {
    if (src) {
      optimizeImage(src);
    }
  }, [src, optimizeImage]);

  return {
    src: imageSrc || placeholder,
    loading,
    error,
    placeholder
  };
};

// Create optimized image URL
export const createOptimizedImageUrl = (src, options = {}) => {
  const {
    quality = 80,
    width,
    height,
    format = 'webp'
  } = options;

  // If it's already an optimized URL, return as is
  if (src.includes('_optimized_')) {
    return src;
  }

  // For external URLs, use a service like Cloudinary or ImageKit
  if (src.startsWith('http')) {
    // Example for Cloudinary
    const baseUrl = 'https://res.cloudinary.com/your-cloud/image/fetch';
    const params = new URLSearchParams({
      f: format,
      q: quality.toString(),
      ...(width && { w: width.toString() }),
      ...(height && { h: height.toString() })
    });
    
    return `${baseUrl}/${encodeURIComponent(src)}?${params}`;
  }

  // For local images, return as is (Next.js will handle optimization)
  return src;
};

// Lazy loading hook
export const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isVisible];
};

// Image preloading utility
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    })
  );
};

// Responsive image hook
export const useResponsiveImage = (src, breakpoints = {}) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    const updateSrc = () => {
      const width = window.innerWidth;
      let newSrc = src;

      // Find appropriate breakpoint
      const sortedBreakpoints = Object.keys(breakpoints)
        .map(Number)
        .sort((a, b) => a - b);

      for (const breakpoint of sortedBreakpoints) {
        if (width >= breakpoint) {
          newSrc = breakpoints[breakpoint];
        }
      }

      setCurrentSrc(newSrc);
    };

    updateSrc();
    window.addEventListener('resize', updateSrc);

    return () => window.removeEventListener('resize', updateSrc);
  }, [src, breakpoints]);

  return currentSrc;
};
