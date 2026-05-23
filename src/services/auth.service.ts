import User from "../model/user.model"; // MongoDB model import karala
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const refreshTokens = new Set<string>();

export const authenticateUser = async (email: string, password: string) => {
  try {
    const existingUser = await User.findOne({ email: email });
    console.log("User found:", existingUser ? "YES" : "NO");

    if (!existingUser) {
      return null;
    }

    const isValidPassword = bcrypt.compareSync(password, existingUser.password);
    console.log("Password valid:", isValidPassword);

    if (!isValidPassword) {
      return null;
    }

    const accessToken = jwt.sign(
      {
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        role: existingUser.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    const refreshToken = jwt.sign(
      {
        email: existingUser.email,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    refreshTokens.add(refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        role: existingUser.role,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};
