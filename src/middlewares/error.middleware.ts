import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../utils/custom-errors';
import logger from '../utils/logger';

// Global error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Check if it's custom errors
    if (err instanceof BaseError) {
        logger.error(`Custom Error [${err.statusCode}]: ${err.message}`);
        return res.status(err.statusCode).json({
            success: false,
            status: 'error',
            message: err.message,
        });
    }

    // unexpected errors
    logger.error('CRITICAL UNHANDLED ERROR:', err.stack);
    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'An unexpected error occurred.',
    });
};