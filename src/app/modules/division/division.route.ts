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
router.get(
  "/",
  checkAuth(...Object.values(Role)),
  divisionController.getAllDivision
);
router.get(
  "/:slug",
  checkAuth(...Object.values(Role)),
  divisionController.getSingleDivision
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.updateDivision
);
export const DivisionRoutes = router;
