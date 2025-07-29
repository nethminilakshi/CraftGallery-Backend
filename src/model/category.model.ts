import mongoose from "mongoose";

const categoryModel = new mongoose.Schema(
    {
        "id": {
            type: String,
            unique: true,
            index: true,
            default: function() {

                const timestamp = Date.now().toString();
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                return `CATEGORY_${timestamp}_${random}`;
            }
        } ,
        "category" : {
            required: true,
            type: String
        },
        "description" : {
            required: true,
            type: String
        }
    }
);

const Category = mongoose.model('Category', categoryModel);
export default Category;