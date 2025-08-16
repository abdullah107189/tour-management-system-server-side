/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.CreateUser
);
router.get(
  "/all-users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }
      const verifiedToken = jwt.verify(accessToken, "secretCode");
      if (!verifiedToken) {
        throw new AppError(403, "You are not authorized");
      }
      console.log(verifiedToken);
      if ((verifiedToken as JwtPayload).role !== Role.ADMIN || Role.SUPER_ADMIN) {
        throw new AppError(403, "You are not permitted to view this role!!!");
      }
    } catch (error) {
      next(error);
    }
  },
  userController.GetAllUsers
);

export const UserRoutes = router;
