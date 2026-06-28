export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthTokenResponse {
  token: string;
  expiresIn: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}
