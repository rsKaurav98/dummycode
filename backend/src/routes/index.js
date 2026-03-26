import { authRoutes } from "./authRoutes.js";
import {
  createHttpError,
  createLambdaEvent,
  sendJson,
  sendLambdaResponse
} from "../utils/http.js";

const routes = [...authRoutes];

export async function handleRequest({ request, response, requestUrl }) {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, null);
    return;
  }

  const matchedRoute = routes.find(
    (route) => route.method === request.method && route.path === requestUrl.pathname
  );

  if (!matchedRoute) {
    throw createHttpError(404, "Route not found");
  }

  const event = await createLambdaEvent({ request, requestUrl });
  const lambdaResponse = await matchedRoute.handler(event);

  sendLambdaResponse(response, lambdaResponse);
}
