import { loginController, signupController } from "../controllers/authController.js";
import {
  createHttpError,
  createLambdaResponse,
  parseLambdaJsonBody
} from "../utils/http.js";

export async function signupHandler(event) {
  if (event.httpMethod !== "POST") {
    throw createHttpError(405, "Method not allowed.");
  }

  const body = parseLambdaJsonBody(event.body);
  const result = await signupController({ body });
  return createLambdaResponse(result.statusCode, result.payload);
}

export async function loginHandler(event) {
  if (event.httpMethod !== "POST") {
    throw createHttpError(405, "Method not allowed.");
  }

  const body = parseLambdaJsonBody(event.body);
  const result = await loginController({ body });
  return createLambdaResponse(result.statusCode, result.payload);
}
