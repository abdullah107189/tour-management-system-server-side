import { IUser } from "./user.interface";
import { User } from "./user.model";

const CreateUser = async (payload: Partial<IUser>) => {
  const { name, email, role } = payload;
  const user = await User.create({
    name,
    email,
    role,
  });
  return user;
};
export const UserServices = {
  CreateUser,
};
