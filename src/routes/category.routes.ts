import {Router} from "express";
import {
    getAllCategories,
    saveCategories,
    getCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller"

const categoryRouter: Router = Router()

// Handle requests
categoryRouter.get("/all", getAllCategories);
categoryRouter.post("/save", saveCategories)
categoryRouter.get("/:id",getCategory )
categoryRouter.put("/update/:id",updateCategory)
categoryRouter.delete("/delete/:id",deleteCategory)


export default categoryRouter;