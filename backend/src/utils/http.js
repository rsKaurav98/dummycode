function buildHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

export function createHttpError(statusCode, message, details) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

export function createLambdaResponse(statusCode, payload) {
  return {
    statusCode,
    headers: buildHeaders(),
    body: JSON.stringify(payload)
  };
}

export function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, buildHeaders());

  if (payload === null) {
    response.end();
    return;
  }

  response.end(JSON.stringify(payload));
}

export async function readRawBody(request) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    request.on("data", (chunk) => {
      rawBody += chunk.toString();
    });

    request.on("end", () => {
      if (!rawBody) {
        resolve(undefined);
        return;
      }

      resolve(rawBody);
    });

    request.on("error", reject);
  });
}

export function parseLambdaJsonBody(body) {
  if (!body) {
    return undefined;
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    throw createHttpError(400, "Request body must be valid JSON.");
  }
}

export async function createLambdaEvent({ request, requestUrl }) {
  const rawBody = await readRawBody(request);

  return {
    httpMethod: request.method,
    path: requestUrl.pathname,
    headers: request.headers,
    queryStringParameters: Object.fromEntries(requestUrl.searchParams.entries()),
    body: rawBody || null,
    isBase64Encoded: false
  };
}

export function sendLambdaResponse(response, lambdaResponse) {
  const statusCode = lambdaResponse?.statusCode ?? 200;
  const headers = {
    ...buildHeaders(),
    ...(lambdaResponse?.headers || {})
  };

  response.writeHead(statusCode, headers);
  response.end(lambdaResponse?.body ?? "");
}

export function sendError(response, error) {
  const statusCode = error.statusCode || 500;
  const message = statusCode >= 500 ? "Internal server error." : error.message;

  sendLambdaResponse(
    response,
    createLambdaResponse(statusCode, {
      success: false,
      message,
      error: error.message
    })
  );
}
