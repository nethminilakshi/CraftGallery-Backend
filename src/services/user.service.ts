import User from "../model/user.model";
import {UserDto} from "../dto/user.dto";


export const getAllUsers = (): Promise<any> => {
    return User.find();
}

import bcrypt from 'bcryptjs';

export const saveUser = async (user: UserDto): Promise<UserDto> => {
    try {

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);


        const userWithHashedPassword = {
            ...user,
            password: hashedPassword
        };



        return await User.create(userWithHashedPassword);

    } catch (error) {

        throw error;
    }
};


export const getUserById = async (id: string): Promise<UserDto | null> => {
    return User.findOne({id: id});
}

export const updateUsers = async (id: string, data: UserDto) => {
    const user = await User.findOneAndUpdate({id: id}, data, {new: true});
    if ((!user)) {
        return null;
    }
    return user;
}

export const deleteUser = async (id: string) => {
    await User.deleteOne({id: id});
    return true
}

export const validateUser = (user: UserDto) => {
    if (!user.firstName || !user.email ||  !user.password || !user.role) {
        return "All fields are required! ";
    }
    return null
}