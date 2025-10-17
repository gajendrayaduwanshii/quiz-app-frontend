// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
  }

  // Start timing
  startTiming(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  // End timing
  endTiming(name) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
    }
  }

  // Get timing
  getTiming(name) {
    return this.metrics.get(name);
  }

  // Get all timings
  getAllTimings() {
    return Array.from(this.metrics.entries());
  }

  // Clear timings
  clearTimings() {
    this.metrics.clear();
  }

  // Monitor component render time
  monitorComponent(componentName) {
    return {
      start: () => this.startTiming(`component_${componentName}`),
      end: () => this.endTiming(`component_${componentName}`)
    };
  }

  // Monitor API calls
  monitorApiCall(apiName) {
    return {
      start: () => this.startTiming(`api_${apiName}`),
      end: () => this.endTiming(`api_${apiName}`)
    };
  }

  // Monitor user interactions
  monitorInteraction(interactionName) {
    return {
      start: () => this.startTiming(`interaction_${interactionName}`),
      end: () => this.endTiming(`interaction_${interactionName}`)
    };
  }

  // Get performance report
  getReport() {
    const timings = this.getAllTimings();
    const report = {
      totalMetrics: timings.length,
      componentMetrics: timings.filter(([name]) => name.startsWith('component_')),
      apiMetrics: timings.filter(([name]) => name.startsWith('api_')),
      interactionMetrics: timings.filter(([name]) => name.startsWith('interaction_')),
      averageComponentTime: this.getAverageTime('component_'),
      averageApiTime: this.getAverageTime('api_'),
      averageInteractionTime: this.getAverageTime('interaction_')
    };

    return report;
  }

  // Get average time for a category
  getAverageTime(category) {
    const categoryTimings = this.getAllTimings()
      .filter(([name]) => name.startsWith(category))
      .map(([, metric]) => metric.duration)
      .filter(duration => duration !== null);

    if (categoryTimings.length === 0) return 0;

    return categoryTimings.reduce((sum, duration) => sum + duration, 0) / categoryTimings.length;
  }

  // Monitor memory usage
  monitorMemory() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Monitor network requests
  monitorNetwork() {
    const entries = performance.getEntriesByType('navigation');
    if (entries.length > 0) {
      const nav = entries[0];
      return {
        dns: nav.domainLookupEnd - nav.domainLookupStart,
        tcp: nav.connectEnd - nav.connectStart,
        request: nav.responseStart - nav.requestStart,
        response: nav.responseEnd - nav.responseStart,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        load: nav.loadEventEnd - nav.loadEventStart
      };
    }
    return null;
  }

  // Monitor Core Web Vitals
  monitorCoreWebVitals() {
    const vitals = {};

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      vitals.lcp = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        vitals.fid = entry.processingStart - entry.startTime;
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      vitals.cls = clsValue;
    }).observe({ entryTypes: ['layout-shift'] });

    return vitals;
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitoring = (componentName) => {
  const monitor = performanceMonitor.monitorComponent(componentName);

  return {
    startRender: monitor.start,
    endRender: monitor.end
  };
};

// Higher-order component for performance monitoring
export const withPerformanceMonitoring = (WrappedComponent) => {
  const MonitoredComponent = (props) => {
    const { startRender, endRender } = usePerformanceMonitoring(WrappedComponent.name);

    useEffect(() => {
      startRender();
      return () => endRender();
    }, [startRender, endRender]);

    return <WrappedComponent {...props} />;
  };

  MonitoredComponent.displayName = `Monitored(${WrappedComponent.displayName || WrappedComponent.name})`;
  return MonitoredComponent;
};

// Utility for measuring function execution time
export const measureExecutionTime = (fn, name) => {
  return async (...args) => {
    const monitor = performanceMonitor.monitorApiCall(name);
    monitor.start();
    
    try {
      const result = await fn(...args);
      return result;
    } finally {
      monitor.end();
    }
  };
};

// Utility for measuring component render time
export const measureRenderTime = (componentName) => {
  return (WrappedComponent) => {
    const MeasuredComponent = (props) => {
      const { startRender, endRender } = usePerformanceMonitoring(componentName);

      useEffect(() => {
        startRender();
        return () => endRender();
      }, [startRender, endRender]);

      return <WrappedComponent {...props} />;
    };

    MeasuredComponent.displayName = `Measured(${WrappedComponent.displayName || WrappedComponent.name})`;
    return MeasuredComponent;
  };
};
