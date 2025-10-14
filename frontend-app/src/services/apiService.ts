import axios, { AxiosInstance } from 'axios';

// API Configuration - pointing to Spring Boot backend
const API_BASE_URL = 'http://localhost:8080';

// ============= TYPE DEFINITIONS =============

export interface User {
  userid: number;
  userName: string;
  email: string;
}

export interface Budget {
  budgetid?: number;
  startDate: string; // yyyy-MM-dd format
  endDate: string;   // yyyy-MM-dd format
  amount: number;
  amountUsed: number;
  user?: User;
}

export interface Expense {
  expenseid?: number;
  amount: number;
  date: string; // Date as ISO string
  description: string;
  type: string;
  payment_Method: string;
  budget?: Budget;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface RegisterData {
  userName: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// ============= API SERVICE CLASS =============

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
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
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ============= AUTHENTICATION =============

  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await this.api.post<string>('/login', credentials);
      const token = response.data;
      
      if (token && token !== 'fail') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userName', credentials.userName);
        return token;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await this.api.post<User>('/register', userData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    this.clearAuth();
  }

  private clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
  }

  // ============= BUDGET MANAGEMENT =============

  async createBudget(budget: Omit<Budget, 'budgetid' | 'user' | 'amountUsed'>): Promise<Budget> {
    try {
      const budgetData = {
        ...budget,
        amountUsed: 0
      };
      const response = await this.api.post<Budget>('/api/budgets', budgetData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBudget(): Promise<Budget | null> {
    try {
      const response = await this.api.get<Budget>('/api/budgets');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw this.handleError(error);
    }
  }

  async updateBudget(budget: Partial<Budget>): Promise<Budget> {
    try {
      const response = await this.api.put<Budget>('/api/budgets', budget);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteBudget(): Promise<void> {
    try {
      await this.api.delete('/api/budgets');
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ============= EXPENSE MANAGEMENT =============

  async addExpense(expense: Omit<Expense, 'expenseid' | 'budget'>): Promise<Expense> {
    try {
      const response = await this.api.post<Expense>('/api/expenses', expense);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAllExpenses(): Promise<Expense[]> {
    try {
      const response = await this.api.get<Expense[]>('/api/expenses');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getExpenseById(id: number): Promise<Expense> {
    try {
      const response = await this.api.get<Expense>(`/api/expenses/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateExpense(id: number, expense: Partial<Expense>): Promise<Expense> {
    try {
      const response = await this.api.put<Expense>(`/api/expenses/${id}`, expense);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteExpense(id: number): Promise<void> {
    try {
      await this.api.delete(`/api/expenses/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // ============= UTILITY METHODS =============

  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getStoredUserName(): string | null {
    return localStorage.getItem('userName');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  // Error handling
  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || error.response.data || 'An error occurred',
        status: error.response.status
      };
    } else if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0
      };
    }
  }
}

export const apiService = new ApiService();
