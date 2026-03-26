import http from "node:http";
import { URL } from "node:url";
import { handleRequest } from "./routes/index.js";
import { sendError } from "./utils/http.js";

export function createServer() {
  return http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url, `http://${request.headers.host}`);
      await handleRequest({ request, response, requestUrl });
    } catch (error) {
      sendError(response, error);
    }
  });
}
