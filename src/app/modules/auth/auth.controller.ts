/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // more code
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      data: loginInfo,
      message: "User Logged In Successfully",
    });
  }
);
export const AuthController = {
  credentialsLogin,
};
