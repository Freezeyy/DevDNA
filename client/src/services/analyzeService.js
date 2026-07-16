import api from './api.js';

/**
 * Domain-specific API calls for developer analysis.
 */
export function analyzeDeveloper(username, refresh = false) {
  return api.post('/api/analyze', { username, refresh });
}

export default { analyzeDeveloper };
