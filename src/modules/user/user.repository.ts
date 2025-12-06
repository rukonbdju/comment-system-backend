import userModel from "../user/user.model"
import { CreateUserDTO } from "./user.types"

const UserRepository = {
    createUser: async (userData: CreateUserDTO) => {
        const newUser = new userModel(userData);
        return newUser.save();
    },
    findUserById: async (id: string) => {
        return userModel.findById(id)
    },
    findUserByEmail: async (email: string) => {
        return userModel.findOne({ email })
    }
}

export default UserRepository;