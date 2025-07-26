// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import {User} from "../model/user.model";
//
// // Load the environment variable from the file
// dotenv.config();
// const JWT_SECRET = process.env.JWT_SECRET as string;
// const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET as string;
// const refreshTokens = new Set<string>();
//
// const adminUser : User = {
//     id: 1,
//     username: "admin",
//     password: bcrypt.hashSync("1234", 10), // hashed password
//     role: "admin"
// }
//
// const customer : User = {
//     id: 2,
//     username: "customer",
//     password: bcrypt.hashSync("1234", 10), // hashed password
//     role: "customer"
// }
// const userList : User[] = [];
// userList.push(adminUser);
// userList.push(customer);
//
// export const authenticateUser = (username : string, password : string) => {
// const existingUser: User | undefined = userList.find(user => user.username === username)
//   let isValidPassword = undefined != existingUser && bcrypt.compareSync(password,existingUser?.password)
//     if(!existingUser || !isValidPassword) {
//         return null;
//     }
//
//    const accessToken = jwt.sign({
//         id: existingUser.id,
//         username: existingUser.username,
//         role: existingUser.role
//     },
//          JWT_SECRET, {expiresIn: "5m"});
//     const refreshToken = jwt.sign({
//         username: existingUser.username
//     }, REFRESH_TOKEN_SECRET,{
//       expiresIn: "7d"
//     });
//
//     refreshTokens.add(refreshToken);
//     return {accessToken, refreshToken
//     };
// }

import User from "../model/user.model"; // MongoDB model import karala
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const refreshTokens = new Set<string>();

export const authenticateUser = async (email: string, password: string) => {
    try {

        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return null;
        }


        const isValidPassword = bcrypt.compareSync(password, existingUser.password);

        if (!isValidPassword) {
            return null;
        }


        const accessToken = jwt.sign({
            id: existingUser.id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            role: existingUser.role
        }, JWT_SECRET, { expiresIn: "24h" });

        const refreshToken = jwt.sign({
            email: existingUser.email
        }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        refreshTokens.add(refreshToken);

        return {
            accessToken,
            refreshToken,
            user: {
                id: existingUser.id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                role: existingUser.role
            }
        };

    } catch (error) {
        console.error("Authentication error:", error);
        return null;
    }
};