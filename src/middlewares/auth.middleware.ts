import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BaseError } from '../utils/custom-errors';
import env from '../config/env.config';
export interface AuthenticatedRequest extends Request {
    user?: { // The property added by the middleware
        userId: string;
    };
}

interface JwtPayload {
    userId: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken;
        console.log({ token })
        if (!token) {
            throw new BaseError('Unauthorized: No token provided', 401);
        }

        const decoded = jwt.verify(
            token,
            env.ACCESS_TOKEN_SECRET
        ) as JwtPayload;

        (req as any).user = decoded; // attach userId to request

        next();
    } catch (error) {
        next(new BaseError('Unauthorized: Invalid or expired token', 401));
    }
};
