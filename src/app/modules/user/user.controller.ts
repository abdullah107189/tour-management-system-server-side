import { Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
const CreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email,role } = req.body;
    const user = await User.create({
      name,
      email,
      role
    });
    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    console.log(error);
    res.status(httpStatus.CREATED).json({
      message: `Something went wrong!! ${error.message}`,
      error,
    });
  }
};

export const userController = {
  CreateUser,
};
