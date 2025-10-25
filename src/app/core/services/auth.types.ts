export interface LoginRequest {
  email: string;
  password: string;
}

export interface SlimLoginResponse {
  token: string;
  email: string;
  fullName: string;
  expiration: string;
}
