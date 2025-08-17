/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.CreateUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.GetAllUsers
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userController.UpdateUser
);
export const UserRoutes = router;
