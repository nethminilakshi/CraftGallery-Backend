import {Request, Response} from "express";
import * as userService from '../services/user.service';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong!'
        });
    }
}

export const saveUser = async (req: Request, res: Response) => {

    try {
        const newUser = req.body;
        const validationError = userService.validateUser(newUser);
        if (validationError) {
            res.status(400).json({
                error: validationError
            });
            return
        }
        const savedUser = await userService.saveUser(newUser)
        res.status(201).json(savedUser)

    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong'
        })
    }

}


export const updateUser = async (req: Request, res: Response) => {
    const userId = (req.params.id);

    const updatedUser = await userService.updateUsers(userId, req.body);
    if (!updatedUser) {
        res.status(404).json({
            error: 'Project not found'
        });
        return;
    }
    res.status(200).json(updatedUser);
}

export const getUser = async (req: Request, res: Response) => {
    const userId = (req.params.id);
    const user = await userService.getUserById(userId);
    if (!user) {
        res.status(404).json({
            error: 'User not found'
        });
        return;
    }}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = (req.params.id);

    const deletionResult = await userService.deleteUser(userId);
    if (!deletionResult) {
        res.status(404).json({
            error: 'User not found'
        });
        return;
    }
    res.status(200).json({
        message : 'User deleted successfully!'
    })
}