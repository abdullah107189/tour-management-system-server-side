import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
const CreateUser = async (payload: Partial<IUser>) => {
  const { email, password,role, ...rest } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists.");
  }
  const hashedPassword = await bcryptjs.hash(password as string, 10);
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };
  const user = await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,
    role: role || Role.USER,
    ...rest,
  });
  return user;
};
const GetAllUsers = async () => {
  const users = await User.find({});
  const totalCount = await User.countDocuments();
  return {
    data: users,
    meta: { total: totalCount },
  };
};
export const UserServices = {
  CreateUser,
  GetAllUsers,
};
