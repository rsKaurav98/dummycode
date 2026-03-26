import { loginHandler, signupHandler } from "../lambdas/auth.js";

export const authRoutes = [
  {
    method: "POST",
    path: "/api/signup",
    handler: signupHandler
  },
  {
    method: "POST",
    path: "/api/login",
    handler: loginHandler
  }
];
