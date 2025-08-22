import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { divisionController } from "./division.controller";
import { createDivisionZodSchema } from "./division.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionZodSchema),
  divisionController.createDivision
);
export const DivisionRoutes = router;
