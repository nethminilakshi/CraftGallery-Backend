import User from "../model/user.model";
import { UserDto } from "../dto/user.dto";

export const getAllUsers = (): Promise<any> => {
  return User.find();
};

import bcrypt from "bcryptjs";

export const saveUser = async (user: UserDto): Promise<UserDto> => {
  try {
    console.log("saveUser called with:", user); // ← add කරන්න

    if (!user.password) {
      throw new Error("Password is required");
    }

    const saltRounds = 10;
    console.log("Hashing password..."); // ← add කරන්න
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    console.log("Password hashed successfully"); // ← add කරන්න

    const userWithHashedPassword = {
      ...user,
      password: hashedPassword,
    };

    console.log("Saving to DB..."); // ← add කරன්න
    const result = await User.create(userWithHashedPassword);
    console.log("Saved successfully:", result); // ← add කරන්න
    return result;
  } catch (error) {
    console.error("saveUser ERROR:", error); // ← add කරන්න
    throw error;
  }
};

export const getUserById = async (id: string): Promise<UserDto | null> => {
  return User.findOne({ id: id });
};

export const updateUsers = async (id: string, data: UserDto) => {
  const user = await User.findOneAndUpdate({ id: id }, data, { new: true });
  if (!user) {
    return null;
  }
  return user;
};

export const deleteUser = async (id: string) => {
  await User.deleteOne({ id: id });
  return true;
};

export const validateUser = (user: UserDto) => {
  if (!user.firstName || !user.email || !user.password || !user.role) {
    return "All fields are required! ";
  }
  return null;
};
