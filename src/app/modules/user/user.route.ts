import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.CreateUser);
// router.get("/", userController.GetAllUsers);

export const UserRoutes = router;
