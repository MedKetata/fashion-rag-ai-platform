const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = async (
    endpoint: string,
    options: RequestInit = {}
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>)
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
};