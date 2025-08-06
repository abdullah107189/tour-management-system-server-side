import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.CreateUser);

export const UserRoutes = router;
