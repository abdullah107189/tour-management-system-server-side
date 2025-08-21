/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { setAuthCookie } from "../../utils/setCookie";
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";
import { createTokens } from "../../utils/userTokens";
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      data: loginInfo,
      message: "User Logged In Successfully",
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshToken", refreshToken);
    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token Provided!");
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      data: tokenInfo,
      message: "New Access Token Get Successfully",
    });
  }
);
const userLogout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Password Reset Successfully",
      data: null,
    });
  }
);

const openGoogle = async (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
};
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let state = req.query.state ? (req.query.state as string) : "";
    if (state.startsWith("/")) {
      state = state.slice(1)
    }
    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const tokenInfo = createTokens(user);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${state}`);
  }
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  userLogout,
  resetPassword,
  openGoogle,
  googleCallbackController,
};
