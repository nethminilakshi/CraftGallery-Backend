import {Request, Response} from "express";
import * as categoryService from '../services/category.service';

export const getAllCategories = async (req : Request, res: Response) =>{
    try {
        const categories =await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error){
        res.status(500).json({
            error : 'something went wrong!'
        });
    }
}


export const saveCategories = async (req : Request, res: Response) => {
    try{
        const newCategory = req.body;
        const validationError = categoryService.validateCategory(newCategory);
        if(validationError) {
            res.status(400).json({
                error: validationError
            });
            return
        }
        const saveCategory =await categoryService.saveCategory(newCategory);
        res.status(201).json(saveCategory)
    } catch (error){
        console.error(error);
        res.status(500).json({
            error : 'something went wrong!'
        });
    }

}

export const getCategory = async (req : Request, res: Response)=>{
    const categoryId = (req.params.id);
    // if(isNaN(categoryId)){
    //     res.status(400).json({
    //         error : 'Invalid Category Id'
    //     });
    //     return
    // }
    const category =await categoryService.getCategoryById(categoryId);
    if(!category){
        res.status(404).json({
            error : 'Product not found'
        });
        return;
    }
    res.status(200).json(category)
}

export const updateCategory =async (req : Request, res: Response)=>{
    const categoryId = (req.params.id);
    // if(isNaN(categoryId)){
    //     res.status(400).json({
    //         error : 'Invalid Category Id'
    //     });
    //     return
    // }
    const updatedData = req.body;
    const updatedCategory = await categoryService.updateCategory(categoryId, updatedData);
    if(!updatedCategory){
        res.status(404).json({
            error : "Category not found"
        });
        return;
    }
    res.status(200).json(updatedCategory)
}

export const deleteCategory =async (req : Request, res: Response)=>{
    const categoryId = (req.params.id);
    // if(isNaN(categoryId)){
    //     res.status(400).json({
    //         error : 'Invalid Category Id'
    //     });
    //     return
    // }
    const deleteCategory =await categoryService.deleteCategory(categoryId);
    if(!deleteCategory){
        res.status(404).json({
            error : 'Category not found'
        });
        return;
    }
    res.status(200).json({
        message : 'Category deleted successfully!'
    })
}
