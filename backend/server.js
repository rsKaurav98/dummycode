import { createServer } from "./src/app.js";
import { env } from "./src/config/env.js";

const server = createServer();

server.listen(env.port, () => {
  console.log(`Auth backend listening on http://localhost:${env.port}`);
});
