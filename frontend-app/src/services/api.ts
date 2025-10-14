import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration - pointing to Spring Boot backend
const API_BASE_URL = 'http://localhost:8080';

// Types for authentication
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // User profile methods
  // ...existing code...

  // ...existing code...
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Transform email to username field for backend compatibility
      const loginData = {
        username: credentials.username, // This can be email or username
        password: credentials.password
      };
      
      const response: AxiosResponse<AuthResponse> = await this.api.post('/login', loginData);
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterData): Promise<{ success: boolean; message?: string }> {
    try {
      const response: AxiosResponse<any> = await this.api.post('/register', userData);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Registration failed.' };
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      await this.api.delete(`/expenses/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // User profile methods
  async getUserProfile(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.get('/profile');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateUserProfile(profileData: any): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.put('/profile', profileData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/logout');
    } catch (error) {
      // Optionally log error, but always clear local storage
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }
  // Utility methods
  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getStoredUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!token;
  }

  // Error handling
  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0
      };
    }
  }
}

export const apiService = new ApiService();

export const registerUser = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
  return apiService.register(userData);
};