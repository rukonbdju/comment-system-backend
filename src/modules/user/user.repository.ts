import { ConflictError } from "../../utils/custom-errors";
import userModel from "../user/user.model"
import { CreateUserDTO } from "./user.types"

const UserRepository = {
    createUser: async (userData: CreateUserDTO) => {
        try {
            const newUser = new userModel(userData);
            return newUser.save();
        } catch (error: any) {
            // Check for Mongoose unique constraint error (usually code 11000)
            if (error.code === 11000) {
                throw new ConflictError('The email address is already in use.');
            }
            throw error;
        }
    },

    /** Finds a user by ID. */
    findUserById: async (id: string) => {
        return userModel.findById(id).lean();
    },

    /** Finds a user by email address. */
    findUserByEmail: async (email: string) => {
        return userModel.findOne({ email }).lean();
    }
}

export default UserRepository;