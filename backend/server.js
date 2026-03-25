import http from "node:http";
import { URL } from "node:url";
import { helloHandler } from "./src/lambdas/hello.js";

const PORT = process.env.PORT || 3001;

const routes = {
  "GET /api/hello": helloHandler
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(JSON.stringify(payload));
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    response.end();
    return;
  }

  const routeKey = `${request.method} ${requestUrl.pathname}`;
  const handler = routes[routeKey];

  if (!handler) {
    sendJson(response, 404, { message: "Route not found" });
    return;
  }

  const event = {
    httpMethod: request.method,
    path: requestUrl.pathname,
    queryStringParameters: Object.fromEntries(requestUrl.searchParams.entries()),
    headers: request.headers
  };

  try {
    const lambdaResponse = await handler(event);
    sendJson(
      response,
      lambdaResponse.statusCode ?? 200,
      typeof lambdaResponse.body === "string"
        ? JSON.parse(lambdaResponse.body)
        : lambdaResponse.body
    );
  } catch (error) {
    sendJson(response, 500, {
      message: "Lambda execution failed",
      error: error.message
    });
  }
});

server.listen(PORT, () => {
  console.log(`Lambda-style backend listening on http://localhost:${PORT}`);
});
