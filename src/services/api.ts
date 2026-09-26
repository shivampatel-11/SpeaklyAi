export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export class ApiService {
  private static baseUrl = '/api/v1'

  // Generic request wrapper structured for future API endpoints
  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      })

      if (!response.ok) {
        return {
          data: null,
          error: `HTTP error ${response.status}: ${response.statusText}`,
          status: response.status,
        }
      }

      const data = await response.json()
      return { data, error: null, status: response.status }
    } catch (err: any) {
      return {
        data: null,
        error: err?.message || 'Network request failed',
        status: 500,
      }
    }
  }
}
