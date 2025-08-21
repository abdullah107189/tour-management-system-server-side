/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong!`;

  if (err instanceof ZodError) {
    statusCode = 400;
    message =
      err.issues.map((issue) => issue.message).join(", ") ||
      "Validation failed";
  } else if (err.code) {
    statusCode = 401;
    const duplicate = err.message.match(/"([^"]*)"/);
    message = `${duplicate[1]} already exist`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid MongoDb ObjectId. Please provide a valid id";
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    err,
    stack: envVars.NODE_DEV == "development" ? err.stack : null,
  });
};
