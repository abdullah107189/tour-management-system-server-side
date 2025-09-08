import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const CreateUser = async (payload: Partial<IUser>) => {
  const { email, password, role, ...rest } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists.");
  }
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.bcrypt_salt_round)
  );
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

const UpdateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  /**
   * user/admin/... exited or not ?
   * user / guide can't change his own role or other's role
   * email - can't update
   * name, phone, password, address
   * password - re hashing
   * only admin and super admin can change - role, isDeleted..
   */

  const isExist = await User.findById(userId);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Not found");
  }
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.bcrypt_salt_round
    );
  }
  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdateUser;
};

export const UserServices = {
  CreateUser,
  GetAllUsers,
  UpdateUser,
};
