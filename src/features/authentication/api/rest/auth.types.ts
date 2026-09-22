export interface AuthUser {
  id: string
  name: string
  email: string
  company: string
}

export interface RegisterRequest {
  name: string
  email: string
  company: string
  password: string
}

export type RegisterResponse = AuthUser

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthSessionResponse {
  accessToken: string
  accessTokenExpiresAtUtc: string
  user: AuthUser
}
