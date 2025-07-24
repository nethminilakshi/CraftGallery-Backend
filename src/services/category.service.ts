import Category from "../model/category.model";
import {CategoryDto} from "../dto/category.dto";

export const getAllCategories = (): Promise<any> => {
    return Category.find();
}

export const saveCategory = async (category: CategoryDto): Promise<any> => {
    return Category.create(category);
}

export const getCategoryById = async (id: string): Promise<CategoryDto | null> => {
    return Category.findOne({id: id});
}

export const updateCategory = async (id: string, data: CategoryDto) => {
    const category = await Category.findOneAndUpdate({id: id}, data, {new: true});
    if ((!category)) {
        return null;
    }
    return category
}

export const deleteCategory = async (id: string) => {
    await Category.deleteOne({id: id});
    return true
}

export const validateCategory = (category: CategoryDto) => {
    if ( !category.category || !category.description) {
        return "All fields are required! ";
    }
    return null
}
