import { IUser } from "./user.interface";
import { User } from "./user.model";

const CreateUser = async (payload: Partial<IUser>) => {
  const { name, email, role } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists.");
    return;
  }
  const user = await User.create({
    name,
    email,
    role,
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
