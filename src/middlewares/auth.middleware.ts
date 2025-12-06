import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BaseError } from '../utils/custom-errors';

interface JwtPayload {
    userId: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new BaseError('Unauthorized: No token provided', 401);
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET!
        ) as JwtPayload;

        (req as any).user = decoded; // attach userId to request

        next();
    } catch (error) {
        next(new BaseError('Unauthorized: Invalid or expired token', 401));
    }
};
