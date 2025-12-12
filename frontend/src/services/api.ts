const BASE_URL = 'https://optic-gov.onrender.com';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(data: {
    wallet_address: string;
    company_name: string;
    email: string;
    password: string;
  }) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Project endpoints
  async createProject(data: {
    name: string;
    description: string;
    total_budget: number;
    contractor_wallet: string;
    use_ai_milestones: boolean;
    manual_milestones?: string[] | null;
    project_latitude: number;
    project_longitude: number;
    location_tolerance_km?: number;
    gov_wallet: string;
    on_chain_id: number;
  }) {
    return this.request('/create-project', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Milestone endpoints
  async generateMilestones(data: {
    project_description: string;
    total_budget: number;
  }) {
    return this.request('/generate-milestones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyMilestone(data: {
    video_url: string;
    milestone_criteria: string;
    project_id: number;
    milestone_index: number;
  }) {
    return this.request('/verify-milestone', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Root endpoint
  async root() {
    return this.request('/');
  }
}

export const apiClient = new ApiClient(BASE_URL);