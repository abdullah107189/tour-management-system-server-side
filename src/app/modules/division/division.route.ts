import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { divisionController } from "./division.controller";
import { createDivisionZodSchema } from "./division.validation";

const router = Router();
router.post(
  "/create",
  validateRequest(createDivisionZodSchema),
  divisionController.createDivision
);
export const DivisionRoutes = router;
