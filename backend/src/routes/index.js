import { authRoutes } from "./authRoutes.js";
import { createHttpError, readJsonBody, sendJson } from "../utils/http.js";

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

  const body = await readJsonBody(request);

  await matchedRoute.handler({
    request,
    response,
    requestUrl,
    body
  });
}
