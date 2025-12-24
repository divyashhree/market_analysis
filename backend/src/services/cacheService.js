const NodeCache = require('node-cache');

/**
 * Cache Service - Simple in-memory caching with TTL
 */
class CacheService {
  constructor() {
    // Cache with 1 hour TTL
    this.cache = new NodeCache({ 
      stdTTL: 3600,
      checkperiod: 600,
      useClones: false
    });

    this.cache.on('expired', (key, value) => {
      console.log(`Cache expired for key: ${key}`);
    });
  }

  /**
   * Get value from cache
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Set value in cache
   */
  set(key, value, ttl = null) {
    if (ttl) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  /**
   * Delete value from cache
   */
  del(key) {
    return this.cache.del(key);
  }

  /**
   * Clear entire cache
   */
  flush() {
    return this.cache.flushAll();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }
}

module.exports = new CacheService();
