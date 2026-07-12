const BASE_URL = 'http://localhost:5000/api';

/**
 * Perform an HTTP request with automatic Bearer token injection and error handling.
 */
export const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Inject active token from localStorage
  const token = localStorage.getItem('af_accessToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    
    let result = null;
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Broadcast unauthorized event for AppContext/App to logout
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      
      const errorMsg = result?.message || result?.errors?.join(', ') || 'An unexpected error occurred';
      const error = new Error(errorMsg);
      error.status = response.status;
      error.errors = result?.errors || null;
      throw error;
    }

    return result;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
