import {Router} from "express";
import{
    deleteUser,
    getAllUsers,
    getUser,
    saveUser,
    updateUser
} from "../controllers/user.controller";
import {authenticateToken, authorizeRole} from "../middleware/auth.middleware";

const userRouter: Router = Router();

userRouter.get("/all",authenticateToken, authorizeRole('ADMIN'),getAllUsers);
userRouter.post("/save", saveUser);
userRouter.get("/:id",authenticateToken, authorizeRole('ADMIN'), getUser);
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/:id", authenticateToken, authorizeRole('ADMIN'), deleteUser);

export default userRouter;