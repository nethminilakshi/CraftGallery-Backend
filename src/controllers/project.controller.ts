import {Request, Response} from "express";
import * as projectService from '../services/project.service';

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await projectService.getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong!'
        });
    }
}


export const saveProjects = async (req: Request, res: Response) => {
    try {
        const newProject = req.body;
        const validationError = projectService.validateProjects(newProject);
        if (validationError) {
            res.status(400).json({
                error: validationError
            });
            return;
        }
        const savedProject = await projectService.saveProjects(newProject);
        res.status(201).json(savedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong!'
        });
    }
}

export const getProjectByCategory = async (req: Request, res: Response) => {
    try {
        // Typo fix: categoryName -> categoryName
        const category = req.params.category;

        // Validation
        if (!category || category.trim() === '') {
            return res.status(400).json({
                error: 'Category name is required'
            });
        }

        const projectDto = await projectService.getProjectByCategory(category);

        // Empty array check (length === 0)
        if (!projectDto ||  projectDto.length === 0) {
            return res.status(404).json({
                error: 'Projects are not found for this category!',
                category: category
            });
        }

        return res.status(200).json(projectDto);

    } catch (error) {
        console.error('Error in getProjects controller:', error);
        return res.status(500).json({
            error: 'Internal server error',

        });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id;

    const project = await projectService.getProjectById(projectId);
    if (!project) {
        res.status(404).json({
            error: 'Project not found'
        });
        return;
    }
    res.status(200).json(project);
}

export const updateProjects = async (req: Request, res: Response) => {
    const projectId = (req.params.id);
    // if (isNaN(projectId)) {
    //     res.status(400).json({
    //         error: 'Invalid Project Id'
    //     });
    //     return;
    // }
    const updatedProject = await projectService.updateProjects(projectId, req.body);
    if (!updatedProject) {
        res.status(404).json({
            error: 'Project not found'
        });
        return;
    }
    res.status(200).json(updatedProject);
}


export const deleteProjects = async (req: Request, res: Response) => {
    const projectId = (req.params.id);
    // if (isNaN(projectId)) {
    //     res.status(400).json({
    //         error: 'Invalid Project Id'
    //     });
    //     return;
    // }
    const deletedProject = await projectService.deleteProjects(projectId);
    if (!deletedProject) {
        res.status(404).json({
            error: 'Project not found'
        });
        return;
    }
    res.status(200).json({
        message: 'Project deleted successfully!'
    })
}