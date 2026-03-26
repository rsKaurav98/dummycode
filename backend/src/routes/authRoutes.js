import { loginController, signupController } from "../controllers/authController.js";

export const authRoutes = [
  {
    method: "POST",
    path: "/api/signup",
    handler: signupController
  },
  {
    method: "POST",
    path: "/api/login",
    handler: loginController
  }
];
