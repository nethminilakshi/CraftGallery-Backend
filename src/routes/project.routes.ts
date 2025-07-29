// routes/project.routes.ts
import { Router } from "express";
import {
    getAllProjects,
    saveProjects,
    getProjectByCategory,
    updateProjects,
    deleteProjects,
    getProjectById,
    getProjectsByEmail,
    testEmail  // Add this import
} from "../controllers/project.controller";
import { authenticateToken, authorizeRole } from "../middleware/auth.middleware";

const projectRouter: Router = Router();

projectRouter.get("/all", getAllProjects);
projectRouter.post("/save", saveProjects);
projectRouter.get("/category/:category", getProjectByCategory);
projectRouter.put("/update/:id", authenticateToken, authorizeRole('USER'), updateProjects);
projectRouter.delete("/delete/:id", deleteProjects);
projectRouter.get("/user/:uploadedUserEmail", getProjectsByEmail);
projectRouter.get("/:id", getProjectById);

// Add test email endpoint (for development)
projectRouter.post("/test-email", testEmail);

export default projectRouter;