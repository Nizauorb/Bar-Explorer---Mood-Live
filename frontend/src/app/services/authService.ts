import { User } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api/auth'  // En production (Apache proxy)
  : 'http://localhost:3000/api/auth';  // En développement

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Get current session from localStorage
const getSession = (): { token: string; user: User } | null => {
  const session = localStorage.getItem('bar_explorer_session');
  if (!session) return null;
  
  try {
    const parsed = JSON.parse(session);
    return parsed;
  } catch {
    localStorage.removeItem('bar_explorer_session');
    return null;
  }
};

// Save session to localStorage
const saveSession = (token: string, user: User): void => {
  localStorage.setItem('bar_explorer_session', JSON.stringify({ token, user }));
};

export const authService = {
  // Register new user
  async register(email: string, password: string, pseudo: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, pseudo }),
      });

      const data = await response.json();

      if (data.success && data.user && data.token) {
        saveSession(data.token, data.user);
        return { success: true, user: data.user, token: data.token };
      }

      return { success: false, error: data.error || 'Erreur lors de l\'inscription' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Erreur réseau lors de l\'inscription' };
    }
  },
  
  // Login user
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user && data.token) {
        saveSession(data.token, data.user);
        return { success: true, user: data.user, token: data.token };
      }

      return { success: false, error: data.error || 'Erreur lors de la connexion' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur réseau lors de la connexion' };
    }
  },
  
  // Logout user
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const session = getSession();
      if (session) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.token}`,
          },
        });
      }
      
      localStorage.removeItem('bar_explorer_session');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('bar_explorer_session');
      return { success: true };
    }
  },
  
  // Get current user from session
  getCurrentUser(): User | null {
    const session = getSession();
    return session ? session.user : null;
  },
  
  // Get current token
  getToken(): string | null {
    const session = getSession();
    return session ? session.token : null;
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return getSession() !== null;
  },
  
  // Update user profile
  async updateUser(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const session = getSession();
      if (!session) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success && data.user) {
        // Update session with new user data
        saveSession(session.token, data.user);
        return { success: true, user: data.user };
      }

      return { success: false, error: data.error || 'Erreur lors de la mise à jour' };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Erreur réseau lors de la mise à jour' };
    }
  },
};