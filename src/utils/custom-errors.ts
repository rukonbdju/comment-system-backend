export class BaseError extends Error {
    // Default to 500 Internal Server Error
    public readonly statusCode: number = 500;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// when resource not found
export class NotFoundError extends BaseError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

// when resource already exist
export class ConflictError extends BaseError {
    constructor(message: string = 'Conflict with existing resource') {
        super(message, 409);
    }
}

//auth error
export class AuthError extends BaseError {
    constructor(message: string = 'Authentication failed.') {
        super(message, 401);
    }
}