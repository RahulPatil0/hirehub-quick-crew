const API_URL = "http://localhost:8080/api/auth";

// REGISTER USER
export const registerUser = async (payload: {
  username: string;               
  email: string;
  phone: string;
  password: string;
  role: "OWNER" | "WORKER" | "ADMIN"; 
}) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Registration failed");
  }

  return response.json(); // JwtResponse from backend
};

// --------------------------------------------
// LOGIN USER
// --------------------------------------------
export const loginUser = async (payload: {
  email: string;
  password: string;
  role: "OWNER" | "WORKER" | "ADMIN"; 
}) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Login failed");
  }

  return response.json(); // JwtResponse from backend
};
