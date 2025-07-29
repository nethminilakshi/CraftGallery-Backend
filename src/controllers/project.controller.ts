import {Request, Response} from "express";
import * as projectService from '../services/project.service';
import { EmailService } from '../services/email.service';
import jwt from 'jsonwebtoken';

// Interface for JWT payload
interface JwtPayload {
    userId: string;
    username: string;
    email: string;
    role: string;
}

// Helper function to extract user info from token
const getUserFromToken = (req: Request): JwtPayload | null => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

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

        // Validate project data
        const validationError = projectService.validateProjects(newProject);
        if (validationError) {
            res.status(400).json({
                error: validationError
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newProject.uploadedUserEmail)) {
            res.status(400).json({
                error: 'Invalid email format'
            });
            return;
        }

        // Save project using your existing service
        const savedProject = await projectService.saveProjects(newProject);

        // Get user info from JWT token for personalized email
        const userInfo = getUserFromToken(req);
        const userName = userInfo?.username || newProject.author;

        // Send email notification asynchronously (don't wait for it to complete)
        EmailService.sendProjectUploadSuccessEmail(
            newProject.uploadedUserEmail,
            savedProject,
            userName
        ).then((emailSent) => {
            if (emailSent) {
                console.log(`✅ Upload success email sent to: ${newProject.uploadedUserEmail}`);
            } else {
                console.log(`❌ Failed to send upload success email to: ${newProject.uploadedUserEmail}`);
            }
        }).catch((error) => {
            console.error('Email sending error:', error);
        });

        // Respond immediately with success
        res.status(201).json({
            success: true,
            message: 'Project uploaded successfully! Confirmation email sent.',
            project: savedProject
        });

    } catch (error) {
        console.error(error);

        // Handle duplicate key errors
        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            res.status(409).json({
                error: 'Project with this ID already exists'
            });
            return;
        }

        res.status(500).json({
            error: 'Something went wrong!'
        });
    }
}

export const getProjectByCategory = async (req: Request, res: Response) => {
    try {
        const category = req.params.category;

        // Validation
        if (!category || category.trim() === '') {
            return res.status(400).json({
                error: 'Category name is required'
            });
        }

        const projectDto = await projectService.getProjectByCategory(category);

        // Empty array check (length === 0)
        if (!projectDto || projectDto.length === 0) {
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

export const getProjectsByEmail = async (req: Request, res: Response) => {
    try {
        const userEmail = req.params.uploadedUserEmail;

        console.log('Fetching projects for email:', userEmail);

        const projects = await projectService.getProjectsByUserEmail(userEmail);

        if (!projects || projects.length === 0) {
            res.status(200).json({
                success: true,
                message: 'No projects found for this user',
                projects: [],
                count: 0
            });
            return;
        }

        res.status(200).json({
            success: true,
            projects: projects,
            count: projects.length
        });
    } catch (error) {
        console.error('Error fetching projects by email:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch projects'
        });
    }
};

export const updateProjects = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;

        const updatedProject = await projectService.updateProjects(projectId, req.body);

        if (!updatedProject) {
            res.status(404).json({
                error: 'Project not found'
            });
            return;
        }

        // Get user info for personalized email
        const userInfo = getUserFromToken(req);
        const userName = userInfo?.username || updatedProject.author;

        // Send update notification email asynchronously
        if (updatedProject.uploadedUserEmail) {
            EmailService.sendProjectUpdateEmail(
                updatedProject.uploadedUserEmail,
                updatedProject,
                userName
            ).then((emailSent) => {
                if (emailSent) {
                    console.log(`✅ Update notification email sent to: ${updatedProject.uploadedUserEmail}`);
                } else {
                    console.log(`❌ Failed to send update notification email to: ${updatedProject.uploadedUserEmail}`);
                }
            }).catch((error) => {
                console.error('Update email sending error:', error);
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully! Notification email sent.',
            project: updatedProject
        });

    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({
            error: 'Something went wrong!'
        });
    }
}

export const deleteProjects = async (req: Request, res: Response) => {
    const projectId = req.params.id;

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

// Test email endpoint (for development/testing)
export const testEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }

        const emailSent = await EmailService.sendTestEmail(email);

        if (emailSent) {
            res.status(200).json({
                success: true,
                message: 'Test email sent successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email'
            });
        }

    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};