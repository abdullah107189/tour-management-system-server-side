/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await UserServices.CreateUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User created successfully",
//       user,
//     });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     next(error);
//   }
// };
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

export const userController = {
  CreateUser,
  GetAllUsers,
};
