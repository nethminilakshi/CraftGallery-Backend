import Project from "../model/project.model";
import {ProjectDto} from "../dto/project.dto";

export const getAllProjects = (): Promise<any> => {
    return Project.find();
}

export const saveProjects = async (project: ProjectDto): Promise<any> => {
    return Project.create(project);
}

export const getProjectByCategory = async (category: string): Promise<ProjectDto[]> => {
    try {
        const projects = await Project.find({
            category: {
                $regex: category,
                $options: 'i'
            }
        })
            .sort({ category: 1 })
            .lean();

        return projects as ProjectDto[];

    } catch (error) {
        console.error('Error fetching projects by category:', error);
        throw new Error('Failed to fetch projects');
    }
};

export const getProjectById = async (id: string): Promise<ProjectDto | null> => {
    try {
        const project = await Project.findOne({ id: id }).lean();
        return project as ProjectDto | null;
    } catch (error) {
        throw new Error('Failed to fetch project');
    }
}

export const getProjectsByUserEmail = async (email: string): Promise<ProjectDto[]> => {
    try {
        const projects = await Project.find({ uploadedUserEmail: email }).lean();
        return projects as ProjectDto[];
    } catch (error) {
        throw new Error('Failed to fetch projects');
    }
}

export const updateProjects = async (id: string, data: ProjectDto) => {
    const project = await Project.findOneAndUpdate({id: id}, data, {new: true});
    if ((!project)) {
        return null;
    }
    return project
}

export const deleteProjects = async (id: string) => {
    await Project.deleteOne({id: id});
    return true
}

export const validateProjects = (project: ProjectDto) => {
    if (!project.title || !project.description ||  !project.category || !project.uploadedUserEmail) {
        return "All fields are required! ";
    }
    return null
}