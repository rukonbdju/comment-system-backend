import * as bcrypt from 'bcryptjs';
import { CreateUserDTO } from '../user/user.types';
import UserRepository from '../user/user.repository';
import { AuthError, NotFoundError } from '../../utils/custom-errors';

const SALT_ROUNDS = 10;

export const AuthService = {
    register: async (registerData: CreateUserDTO) => {
        const hashedPassword = await bcrypt.hash(registerData.password, SALT_ROUNDS);
        const newUser = await UserRepository.createUser({
            ...registerData,
            password: hashedPassword,
        });

        return { user: newUser };
    },

    /** Handles user login logic. */
    login: async (loginData: { email: string, password: string }) => {
        const { email, password } = loginData;

        const user = await UserRepository.findUserByEmail(email);

        if (!user) {
            throw new NotFoundError('User not found!');
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new AuthError('Invalid credentials.');
        }
        const { password: _, ...userData } = user;

        return { user: userData, };
    },

    /** Fetches the currently authenticated user's details. */
    getProfile: async (userId: string) => {
        const user = await UserRepository.findUserById(userId);

        if (!user) {
            throw new NotFoundError('User not found.');
        }

        // Sanitize the user object
        const { password: _, ...userData } = user;
        return userData;
    }
}