import mongoose from "mongoose";

const projectModel = new mongoose.Schema(

    {
        "id": {
            type: String,
            unique: true,
            index: true,
            default: function() {
                // Generate custom user ID: USER_ + timestamp + random
                const timestamp = Date.now().toString();
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                return `USER_${timestamp}_${random}`;
            }
        },
        "firstName": {
            required: true,
            type: String
        },
        "lastName": {
            required: true,
            type: String
        },
        "email": {
            required: true,
            type: String
        },
        "password": {
            required: true,
            type: String
        }
    }
);

const User = mongoose.model('User', projectModel);
export default User;
