import {Request , Response} from "express";
import * as authService from '../services/auth.service'

export const authenticateUser = async (req: Request, res: Response) => {
   try {
      const {email, password} = req.body;

      if (!email || !password) {
         return res.status(400).json({
            error: "Email and password are required"
         });
      }

      const authTokens = await authService.authenticateUser(email, password);

      if (!authTokens) {
         return res.status(401).json({
            error: "Invalid Credentials"
         });
      }

      res.json(authTokens);

   } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
         error: "Internal server error"
      });
   }
}