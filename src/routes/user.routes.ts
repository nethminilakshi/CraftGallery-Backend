import {Router} from "express";
import{
    deleteUser,
    getAllUsers,
    getUser,
    saveUser,
    updateUser
} from "../controllers/user.controller";

const userRouter: Router = Router();

userRouter.get("/all", getAllUsers);
userRouter.post("/save", saveUser);
userRouter.get("/:id", getUser);
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/:id", deleteUser);

export default userRouter;