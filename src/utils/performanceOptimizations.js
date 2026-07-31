// Performance optimization utilities

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Virtual scrolling for large lists
export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

// Image lazy loading
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [isInView, src]);

  return { imgRef, imageSrc, isLoaded };
};

// Memoized selectors for Redux-like state
export const createMemoizedSelector = (selectors, resultFunc) => {
  let lastResult;
  let lastDeps;

  return (state) => {
    const deps = selectors.map(selector => selector(state));
    
    if (lastDeps && deps.every((dep, index) => dep === lastDeps[index])) {
      return lastResult;
    }
    
    lastDeps = deps;
    lastResult = resultFunc(...deps);
    return lastResult;
  };
};

// Batch state updates
export const batchUpdates = (updates) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
      resolve();
    });
  });
};

// Preload critical resources
export const preloadResources = (resources) => {
  resources.forEach(resource => {
    if (resource.type === 'image') {
      const img = new Image();
      img.src = resource.url;
    } else if (resource.type === 'script') {
      const script = document.createElement('script');
      script.src = resource.url;
      script.async = true;
      document.head.appendChild(script);
    } else if (resource.type === 'style') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = resource.url;
      document.head.appendChild(link);
    }
  });
};

// Optimize re-renders with shouldComponentUpdate logic
export const shouldUpdate = (prevProps, nextProps, keys) => {
  return keys.some(key => prevProps[key] !== nextProps[key]);
};

// Memory management
export const cleanupMemory = () => {
  if (window.gc) {
    window.gc();
  }
  
  // Clear unused caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('unused')) {
          caches.delete(name);
        }
      });
    });
  }
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  };
};

// Bundle size optimization
export const dynamicImport = (importFn) => {
  return React.lazy(importFn);
};

// CSS optimization
export const optimizeCSS = () => {
  // Remove unused CSS
  const styleSheets = Array.from(document.styleSheets);
  styleSheets.forEach(sheet => {
    try {
      const rules = Array.from(sheet.cssRules || sheet.rules);
      rules.forEach(rule => {
        if (rule.type === CSSRule.STYLE_RULE) {
          const selector = rule.selectorText;
          if (selector && !document.querySelector(selector)) {
            sheet.deleteRule(rule);
          }
        }
      });
    } catch (e) {
      // Cross-origin stylesheets can't be accessed
    }
  });
};

// Service Worker optimization
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
};

// Web Workers for heavy computations
export const useWebWorker = (workerScript) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef();

  useEffect(() => {
    workerRef.current = new Worker(workerScript);
    
    workerRef.current.onmessage = (e) => {
      setResult(e.data);
      setLoading(false);
    };

    return () => {
      workerRef.current.terminate();
    };
  }, [workerScript]);

  const postMessage = useCallback((data) => {
    setLoading(true);
    workerRef.current.postMessage(data);
  }, []);

  return { result, loading, postMessage };
};
