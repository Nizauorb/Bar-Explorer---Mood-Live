export interface FavoriteResponse {
  success: boolean;
  favorite?: {
    id: string;
    user_id: string;
    bar_id: string;
    created_at: string;
  };
  error?: string;
}

export interface FavoritesListResponse {
  success: boolean;
  favorites?: Array<{
    id: string;
    bar_id: string;
    created_at: string;
  }>;
  error?: string;
}
