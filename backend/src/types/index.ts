// Types généraux pour l'application Bar Explorer

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Bar {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  phone?: string;
  website?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Vote {
  id: number;
  user_id: number;
  bar_id: number;
  ambiance_score: number; // 0-5
  affluence_level: 'faible' | 'moyenne' | 'pleine';
  created_at: Date;
}

export interface Favorite {
  id: number;
  user_id: number;
  bar_id: number;
  created_at: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthPayload {
  user: Omit<User, 'password'>;
  token: string;
}

export interface CreateVoteDto {
  bar_id: number;
  ambiance_score: number;
  affluence_level: 'faible' | 'moyenne' | 'pleine';
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
