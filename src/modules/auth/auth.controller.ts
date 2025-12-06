import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthError, BaseError } from '../../utils/custom-errors';

export const AuthController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;

            if (!data.name || !data.email || !data.password) {
                throw new BaseError('Missing required data', 400);
            }

            const result = await AuthService.register(data);

            res.status(201).json({
                success: true,
                message: 'Registration successful.',
                data: result.user,
            });
        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await AuthService.login(req.body);

            // ✅ SET HTTP-ONLY COOKIES
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 60 * 1000, // 15 min
            });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({
                success: true,
                message: 'Login successful.',
                data: result.user,
            });
        } catch (error) {
            next(error);
        }
    },

    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            res.status(200).json({
                success: true,
                message: 'Logout successful.',
            });
        } catch (error) {
            next(error);
        }
    },


    refresh: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                throw new BaseError('Refresh token missing', 401);
            }

            const result = await AuthService.refresh(refreshToken);

            // ✅ Rotate access token
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });

            res.status(200).json({
                success: true,
                message: 'Token refreshed',
            });
        } catch (error) {
            next(error);
        }
    },

    getProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.userId;

            if (!userId) {
                throw new AuthError('Unauthorized');
            }

            const userProfile = await AuthService.getProfile(userId);

            res.status(200).json({
                success: true,
                data: userProfile,
            });
        } catch (error) {
            next(error);
        }
    },
};
