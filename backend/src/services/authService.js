import { findUserByEmail, insertUser } from "../repositories/userRepository.js";
import { createHttpError } from "../utils/http.js";
import { hashPassword, normalizeEmail, verifyPassword } from "../utils/password.js";

function isDuplicateEmailError(error) {
  return error?.code === 11000;
}

function validateCredentials(payload) {
  const email = payload?.email?.trim();
  const password = payload?.password?.trim();

  if (!email || !password) {
    throw createHttpError(400, "Email and password are required.");
  }

  if (!email.includes("@")) {
    throw createHttpError(400, "Please enter a valid email address.");
  }

  if (password.length < 6) {
    throw createHttpError(400, "Password must be at least 6 characters long.");
  }

  return {
    email: normalizeEmail(email),
    password
  };
}

export async function registerUser(payload) {
  const { email, password } = validateCredentials(payload);
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw createHttpError(409, "An account with that email already exists.");
  }

  try {
    await insertUser({
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      throw createHttpError(409, "An account with that email already exists.");
    }

    throw error;
  }

  return { email };
}

export async function loginUser(payload) {
  const { email, password } = validateCredentials(payload);
  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw createHttpError(401, "Invalid email or password.");
  }

  return { email };
}
