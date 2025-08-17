import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdmin = await User.findOne({
      email: envVars.super_admin_email,
    });
    if (isSuperAdmin) {
      console.log("Super admin already exited");
      return;
    }
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.super_admin_email,
    };
    const hashPassword = await bcryptjs.hash(
      envVars.super_admin_pass,
      Number(envVars.bcrypt_salt_round)
    );
    const payload: IUser = {
      name: "Super Admin",
      email: envVars.super_admin_email,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      password: hashPassword,
      auths: [authProvider],
    };
    await User.create(payload);
    console.log("Super admin created successfully");
  } catch (error) {
    console.log(error);
  }
};
