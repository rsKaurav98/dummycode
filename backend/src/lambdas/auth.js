import { authenticateUser, createUser } from "../lib/users.js";

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.publicMessage = message;
  return error;
}

function readCredentials(body) {
  const email = body?.email?.trim();
  const password = body?.password?.trim();

  if (!email || !password) {
    throw validationError("Email and password are required.");
  }

  if (!email.includes("@")) {
    throw validationError("Please enter a valid email address.");
  }

  if (password.length < 6) {
    throw validationError("Password must be at least 6 characters long.");
  }

  return { email, password };
}

export async function signupHandler(event) {
  const credentials = readCredentials(event.body);
  const result = await createUser(credentials);

  if (!result.created) {
    return {
      statusCode: 409,
      body: JSON.stringify({
        success: false,
        message: "An account with that email already exists."
      })
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      success: true,
      message: "Signup successful. You can now log in.",
      email: result.email
    })
  };
}

export async function loginHandler(event) {
  const credentials = readCredentials(event.body);
  const result = await authenticateUser(credentials);

  if (!result.authenticated) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: "Invalid email or password."
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: "Login successful.",
      email: result.email
    })
  };
}
