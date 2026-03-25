export async function helloHandler(event) {
  const name = event.queryStringParameters?.name || "Developer";

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}! This came from a Lambda-style Node handler.`,
      timestamp: new Date().toISOString(),
      path: event.path
    })
  };
}
