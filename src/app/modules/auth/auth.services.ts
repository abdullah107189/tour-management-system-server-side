/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import {
  createNewAccessTokenWithRefreshToken,
  createTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
// ==================
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email don't exists.");
  }
  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    existingUser.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password.");
  }
  const userTokens = createTokens(existingUser);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = existingUser.toObject();
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPassword = await bcryptjs.compare(
    oldPassword,
    user?.password as string
  );
  if (!isOldPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password don't match");
  }
  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.bcrypt_salt_round)
  );
user!.save();
};
export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
