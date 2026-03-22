import type { User } from "../context/auth.types";

const BASE_URL = import.meta.env.VITE_API_URL;

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload): Promise<User> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
};

export const loginUser = async (
    email: string,
    password: string
): Promise<User> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return response.json();
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};

export const logoutUser = async (): Promise<{ message: string }> => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
};