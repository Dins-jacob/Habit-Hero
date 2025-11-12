/**
 * Get the API base URL from environment variable
 * Forces HTTPS and handles trailing slashes
 */
export const getApiBaseUrl = (endpoint: string = '') => {
  let baseUrl = import.meta.env.VITE_API_URL || ''
  
  // Force HTTPS if URL is provided
  if (baseUrl && baseUrl.startsWith('http://')) {
    baseUrl = baseUrl.replace('http://', 'https://')
  }
  
  // Remove trailing slash if present
  const cleanUrl = baseUrl.replace(/\/$/, '')
  
  // If no base URL, use relative path (for local development with proxy)
  if (!cleanUrl) {
    return endpoint ? `/api/${endpoint}` : '/api'
  }
  
  // Return full URL with endpoint
  return endpoint ? `${cleanUrl}/api/${endpoint}` : `${cleanUrl}/api`
}

