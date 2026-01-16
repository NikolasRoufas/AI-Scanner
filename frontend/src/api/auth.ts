export interface AuthResponse {
  success?: boolean;
  user_id?: number;
  email?: string;
  error?: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export async function register(payload: AuthPayload): Promise<AuthResponse> {
  try {
    const response = await fetch("http://localhost:5001/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error: any) {
    return { error: error.message || "Registration failed" };
  }
}

/**
 * Login a user
 */
export async function login(payload: AuthPayload): Promise<AuthResponse> {
  try {
    const response = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error: any) {
    return { error: error.message || "Login failed" };
  }
}
