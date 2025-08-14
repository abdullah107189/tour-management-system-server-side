import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.services";
import AppError from "../../errorHelpers/AppError";
const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // throw new AppError(httpStatus.BAD_REQUEST, "fake Error");
    const user = await UserServices.CreateUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
};

// const GetAllUsers = async (req: Request, res: Response) => {
//   try {
//     const result = await User.find();
//     res.status(200).json({
//       message: "All Users get Successfully",
//       data: result,
//     });
//   } catch (error) {
//     res.status(httpStatus.CREATED).json({
//       message: `Something went wrong!! ${error.message}`,
//       error,
//     });
//   }
// };

export const userController = {
  CreateUser,
  // GetAllUsers,
};
