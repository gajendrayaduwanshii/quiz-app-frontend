// Request deduplication utility
class RequestDeduplication {
  constructor() {
    this.pendingRequests = new Map();
  }

  async deduplicate(key, requestFn) {
    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Create new request
    const requestPromise = requestFn()
      .finally(() => {
        // Clean up after request completes
        this.pendingRequests.delete(key);
      });

    // Store the promise
    this.pendingRequests.set(key, requestPromise);

    return requestPromise;
  }

  // Clear all pending requests
  clear() {
    this.pendingRequests.clear();
  }

  // Get pending request count
  getPendingCount() {
    return this.pendingRequests.size;
  }
}

// Global instance
export const requestDeduplication = new RequestDeduplication();

// Helper function for API calls
export const deduplicatedFetch = async (url, options = {}) => {
  const key = `${url}_${JSON.stringify(options)}`;
  
  return requestDeduplication.deduplicate(key, async () => {
    const response = await fetch(url, options);
    return response.json();
  });
};

// Helper function for API calls with caching
export const cachedFetch = async (url, options = {}, cacheTime = 5 * 60 * 1000) => {
  const key = `${url}_${JSON.stringify(options)}`;
  const cacheKey = `cache_${key}`;
  
  // Check cache first
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < cacheTime) {
      return data;
    }
  }

  // Make request with deduplication
  const data = await deduplicatedFetch(url, options);
  
  // Cache the result
  sessionStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }));

  return data;
};
