import { getApiBaseUrl } from '../utils/apiConfig'

const API_BASE_URL = getApiBaseUrl()

export interface HealthResponse {
  status: string
}

class ApiService {
  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`)
    if (!response.ok) {
      throw new Error('Failed to fetch health status')
    }
    return response.json()
  }
}

export const apiService = new ApiService()

