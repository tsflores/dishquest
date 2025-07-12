
// Recipe type for the model schema

export interface Recipe {
  _id: string;
  name: string;
  chef: string;
  description: string;
  meal: string;
  preptime: string;
  cooktime: string;
  image: string;
  recipePDF: string;
  favorites?: boolean | null;
  imageDisplay: string;
  updatedAt?: Date; 
  createdAt: Date | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string; 
  password: string;
}