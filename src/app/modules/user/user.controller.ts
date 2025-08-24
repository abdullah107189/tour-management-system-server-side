/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const CreateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.CreateUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      data: user,
      message: "User created successfully",
    });
  }
);
const GetAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
 
    const result = await UserServices.GetAllUsers();
    sendResponse(res, {
      success: true,
      message: "All Users Retrieved Successfully",
      statusCode: httpStatus.CREATED,
      data: result.data,
      meta: result.meta,
    });
  }
);
const UpdateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user;
    const result = await UserServices.UpdateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      message: "Updated Successfully",
      statusCode: httpStatus.CREATED,
      data: result,
    });
  }
);

export const userController = {
  CreateUser,
  GetAllUsers,
  UpdateUser,
};
