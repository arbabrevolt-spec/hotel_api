import type { Response } from 'express';

export interface ApiResponse {
    success: boolean;
    status: number; // HTTP status code
    message?: string;
    data?: unknown;
    error?: unknown;
}

/**
 * sendResponse — unified envelope for all API responses.
 *
 * Example usages:
 *   sendResponse(res, true, { data: user, message: 'User created' });
 *   sendResponse(res, false, { message: 'Invalid input' }, 400);
 */
export function sendResponse(
    res: Response,
    success: boolean,
    options: { data?: unknown; message?: string; error?: unknown } = {},
    statusCode = 200,
): Response {
    const payload: ApiResponse = {
        success,
        status: statusCode,
        ...options,
    };
    return res.status(statusCode).json(payload);
}
