export interface ProjectDto {
    id: string;
    category: string;
    description: string;
    title: string;
    materials: string[];
    steps: string[];
    imageUrl: string;
    createdAt: Date | string;
    author: string;
    uploadedUserEmail: string;
}
