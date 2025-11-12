/**
 * Get the API base URL from environment variable
 * Forces HTTPS and handles trailing slashes
 */
export const getApiBaseUrl = (endpoint: string = '') => {
  let baseUrl = import.meta.env.VITE_API_URL || ''
  
  // Debug log (only in browser console, not in production bundle)
  if (typeof window !== 'undefined') {
    console.log('[API Config] Original VITE_API_URL:', baseUrl)
  }
  
  // Always force HTTPS - replace http:// with https:// (case insensitive)
  if (baseUrl) {
    // Remove any protocol first
    baseUrl = baseUrl.replace(/^https?:\/\//i, '')
    // Always add https://
    baseUrl = `https://${baseUrl}`
  }
  
  // Remove trailing slash if present
  const cleanUrl = baseUrl.replace(/\/$/, '')
  
  // If no base URL, use relative path (for local development with proxy)
  if (!cleanUrl || cleanUrl === 'https://') {
    return endpoint ? `/api/${endpoint}` : '/api'
  }
  
  // Return full URL with endpoint
  // Don't add trailing slash - FastAPI handles both with and without
  let finalUrl = endpoint ? `${cleanUrl}/api/${endpoint}` : `${cleanUrl}/api`
  
  // Remove double slashes (except after https://)
  finalUrl = finalUrl.replace(/([^:]\/)\/+/g, '$1')
  
  if (typeof window !== 'undefined') {
    console.log('[API Config] Final URL:', finalUrl)
  }
  
  return finalUrl
}

