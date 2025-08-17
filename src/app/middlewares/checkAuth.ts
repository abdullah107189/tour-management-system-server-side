import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.jwt_secret
      ) as JwtPayload;
      if (!verifiedToken) {
        throw new AppError(403, "You are not authorized");
      }
      // console.log(verifiedToken);
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this role!!!");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
