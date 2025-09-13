import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();
router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.userLogout);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthController.resetPassword
);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthController.changePassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthController.setPassword
);
router.post(
  "/forget-password",
  checkAuth(...Object.values(Role)),
  AuthController.forgetPassword
);
router.get("/google", AuthController.openGoogle);

// api/v1/auth/google/callback?state=/booking
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  AuthController.googleCallbackController
);

export const AuthRoutes = router;
