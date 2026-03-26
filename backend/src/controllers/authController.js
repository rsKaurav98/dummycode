import { loginUser, registerUser } from "../services/authService.js";
import { sendJson } from "../utils/http.js";

export async function signupController({ body, response }) {
  const result = await registerUser(body);
  sendJson(response, 201, {
    success: true,
    message: "Signup successful. You can now log in.",
    email: result.email
  });
}

export async function loginController({ body, response }) {
  const result = await loginUser(body);
  sendJson(response, 200, {
    success: true,
    message: "Login successful.",
    email: result.email
  });
}
