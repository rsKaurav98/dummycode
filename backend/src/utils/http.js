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

export function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, buildHeaders());

  if (payload === null) {
    response.end();
    return;
  }

  response.end(JSON.stringify(payload));
}

export async function readJsonBody(request) {
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

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(createHttpError(400, "Request body must be valid JSON."));
      }
    });

    request.on("error", reject);
  });
}

export function sendError(response, error) {
  const statusCode = error.statusCode || 500;
  const message = statusCode >= 500 ? "Internal server error." : error.message;

  sendJson(response, statusCode, {
    success: false,
    message,
    error: error.message
  });
}
