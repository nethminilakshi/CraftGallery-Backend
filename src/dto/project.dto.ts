export interface ProjectDto {
    id: string;
    category: string;
    description: string;
    title: string;
    materials: string[]; // Changed from string to string[]
    steps: string[];     // Changed from string to string[] if it was string before
    imageUrl: string;    // Note: This is imageUrl, not image
    createdAt: Date | string; // Allow both Date and string
    author: string;
    uploadedUserEmail: string;
}
