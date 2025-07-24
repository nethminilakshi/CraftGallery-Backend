import {Router} from "express";
import {
    getAllProjects,
    saveProjects,
    getProjectByCategory,
    updateProjects,
    deleteProjects,
    getProjectById
} from "../controllers/project.controller";

const projectRouter: Router = Router();

projectRouter.get("/all", getAllProjects);
projectRouter.post("/save", saveProjects);
projectRouter.get("/category/:category", getProjectByCategory);
projectRouter.put("/update/:id", updateProjects);
projectRouter.delete("/delete/:id", deleteProjects);
projectRouter.get("/:id", getProjectById)

export default projectRouter;

