import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const statusCode = 500;
    const message = `Something went wrong!! ${err.message} from global error`;
  res.status(statusCode).json({
    success: false,
    message,
    err,
    stack: envVars.NODE_DEV == "development" ? err.stack : null,
  });
};
