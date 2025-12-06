import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../user/user.repository';
import {
    AuthError,
    BaseError,
    ConflictError,
    NotFoundError,
} from '../../utils/custom-errors';
import env from '../../config/env.config';

interface JwtPayload {
    userId: string;
}

//TOKEN HELPERS
const generateAccessToken = (payload: JwtPayload) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: Number(env.ACCESS_TOKEN_EXPIRES_IN),
    });
};

const generateRefreshToken = (payload: JwtPayload) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
        expiresIn: Number(env.REFRESH_TOKEN_EXPIRES_IN),
    });
};

//AUTH SERVICE
export const AuthService = {

    register: async (payload: any) => {
        const { name, email, password } = payload;
        const existingUser = await UserRepository.findUserByEmail(email);
        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await UserRepository.createUser({
            name,
            email,
            password: hashedPassword,
        });

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        };
    },

    login: async (payload: any) => {
        const { email, password } = payload;

        if (!email || !password) {
            throw new BaseError('Email and password required', 400);
        }

        const user = await UserRepository.findUserByEmail(email);

        if (!user) {
            throw new AuthError('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AuthError('Invalid email or password');
        }

        const tokenPayload = {
            userId: user._id.toString(),
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        };
    },

    refresh: async (refreshToken: string) => {
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET!
            ) as JwtPayload;

            const user = await UserRepository.findUserById(decoded.userId);
            if (!user) {
                throw new AuthError('User no longer exists');
            }

            const newAccessToken = generateAccessToken({
                userId: user._id.toString(),
            });

            return { accessToken: newAccessToken };
        } catch (error) {
            throw new AuthError('Invalid or expired refresh token');
        }
    },

    getProfile: async (userId: string) => {
        const user = await UserRepository.findUserById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
        };
    },
};
