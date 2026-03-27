export interface User {
  id: string;
  email: string;
  pseudo: string;
  avatar?: string;
  preferences: {
    musicGenres: string[];
    goOutFrequency: string;
  };
  favoriteBarIds: string[];
  friends: string[];
  email_verified?: boolean;
  last_login?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  pseudo: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
