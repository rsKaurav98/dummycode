import { loginUser, registerUser } from "../services/authService.js";

export async function signupController({ body }) {
  const result = await registerUser(body);
  return {
    statusCode: 201,
    payload: {
      success: true,
      message: "Signup successful. You can now log in.",
      email: result.email
    }
  };
}

export async function loginController({ body }) {
  const result = await loginUser(body);
  return {
    statusCode: 200,
    payload: {
      success: true,
      message: "Login successful.",
      email: result.email
    }
  };
}
