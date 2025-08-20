const API_BASE_URL = 'http://localhost:3001/api'

interface ApiResponse {
    success: boolean,
    data: JSON,
    message?: string,
    errors?: string
}

interface ApiError {
    message: string,
    status: number,
    errors?: string
}