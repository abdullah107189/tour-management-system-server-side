/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import {
  createNewAccessTokenWithRefreshToken,
  createTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";
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

const changePassword = async (
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
const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.userId) {
    throw new AppError(401, "You can not reset your password");
  }
  const isUserExist = await User.findById(decodedToken.userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User don't exists.");
  }
  const hashedPassword = await bcryptjs.hash(
    payload?.newPassword,
    Number(envVars.bcrypt_salt_round)
  );
  isUserExist.password = hashedPassword;
  await isUserExist.save();
};
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider == "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set your password. Now you can change the password from your profile password update"
    );
  }
  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.bcrypt_salt_round)
  );
  const credentialsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };
  const auths: IAuthProvider[] = [...user.auths, credentialsProvider];
  user.password = hashedPassword;
  user.auths = auths;
  await user.save();
};
const forgetPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email don't exists.");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User don't verified.");
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }
  const JwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const resetToken = jwt.sign(JwtPayload, envVars.jwt_secret, {
    expiresIn: "10m",
  });
  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};
export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
  resetPassword,
  setPassword,
  forgetPassword,
};
