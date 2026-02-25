import { Request, Response, NextFunction } from 'express'
import { APIError } from '../errors/api'

/**
 * Sends a successful response with a status code of 200 and a JSON payload.
 * This is typically used to send a successful response back to the client.
 * 
 * @param {Response} res - The Express response object to send the response.
 * @param {object} response - The response payload to be sent back in the JSON format.
 * 
 * @returns {void} - This function does not return anything. It simply sends the response.
 * 
 * @example
 * success(res, { message: 'Request was successful' })
 */
export function success(res: Response, response: object): void {
    res.status(200).json(response)
}

/**
 * Error handling middleware for managing different types of errors.
 * This function sends a response with the appropriate status code and error message based on the error type.
 *
 * @param {APIError | PaymentRequired | Error} err - The error object thrown.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send the error response.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @returns {void} - Sends the error response to the client.
 */
export function interceptor(
    err: APIError | Error ,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Check if the error is an instance of APIError
    if (err instanceof APIError) {
        // Handle APIError with custom code, message, and details
        res.status(err.statusCode || 500).json({
            code: err.code,
            message: err.message,
            details: err.details
        })
    }  else {
        // Default handler for unexpected errors
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: err.message || 'An unexpected error occurred',
        })
    }
}