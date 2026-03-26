import http from "node:http";
import { URL } from "node:url";
import { helloHandler } from "./src/lambdas/hello.js";
import { loginHandler, signupHandler } from "./src/lambdas/auth.js";

const PORT = process.env.PORT || 3001;

const routes = {
  "GET /api/hello": helloHandler,
  "POST /api/signup": signupHandler,
  "POST /api/login": loginHandler
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      if (!body) {
        resolve(undefined);
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Request body must be valid JSON"));
      }
    });

    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
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
    headers: request.headers,
    body: undefined
  };

  try {
    event.body = await readRequestBody(request);
    const lambdaResponse = await handler(event);
    sendJson(
      response,
      lambdaResponse.statusCode ?? 200,
      typeof lambdaResponse.body === "string"
        ? JSON.parse(lambdaResponse.body)
        : lambdaResponse.body
    );
  } catch (error) {
    const statusCode = error.statusCode ?? 500;
    sendJson(response, statusCode, {
      message: error.publicMessage || "Lambda execution failed",
      error: error.message
    });
  }
});

server.listen(PORT, () => {
  console.log(`Lambda-style backend listening on http://localhost:${PORT}`);
});
