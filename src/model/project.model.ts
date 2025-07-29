import mongoose from "mongoose";

const projectModel = new mongoose.Schema(
    {
        "id": {
            type: String,
            unique: true,
            index: true,
            default: function() {

                const timestamp = Date.now().toString();
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                return `PROJECT_${timestamp}_${random}`;
            }
        } ,
       "title": {
            required: true,
            type: String
        },
        "description": {
            required: true,
            type: String
        },
        "materials": {
            required: true,
            type: [String]
        },
        "steps": {
            required: true,
            type: [String]
        },
        "imageUrl": {
            required: true,
            type: String
        },
        "createdAt": {
            required: true,
            type: Date,
            default: Date.now
        },
        "category": {
            required: true,
            type: String
        },
        "author": {
            required: true,
            type: String
        },
        "uploadedUserEmail": {
            required: true,
            type: String
        }
    }
);

const Project = mongoose.model('Project', projectModel);
export default Project;
