import {Router} from "express";
import {
    getAllCategories,
    saveCategories,
    getCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller"
import {authenticateToken, authorizeRole} from "../middleware/auth.middleware";

const categoryRouter: Router = Router()

categoryRouter.get("/all", getAllCategories);
categoryRouter.post("/save", authenticateToken,authorizeRole('ADMIN'),saveCategories)
categoryRouter.get("/:id",getCategory )
categoryRouter.put("/update/:id",authenticateToken, authorizeRole('ADMIN'),updateCategory)
categoryRouter.delete("/delete/:id",authenticateToken, authorizeRole('ADMIN'),deleteCategory)


export default categoryRouter;