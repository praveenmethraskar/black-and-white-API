// Logger.ts
import { AsyncLocalStorage } from "node:async_hooks"
import { v4 as uuidv4 } from "uuid"
import { Request, Response, NextFunction } from "express" // Import express types

const COLORS = {
    INFO: "\x1b[37m", // White
    DEBUG: "\x1b[30m", // Cyan
    WARN: "\x1b[33m", // Yellow
    ERROR: "\x1b[31m", // Red
    RESET: "\x1b[0m", // Reset to default color
}
/**
 * A logger object for outputting messages with contextual information such as file and line number.
 * It supports logging messages with different severity levels (info, error, warn, debug) and sanitizing request bodies
 * by redacting sensitive fields (e.g., passwords, tokens).
 * The logger also attaches a unique request ID to each request to track logs across a request lifecycle.
 */
export interface Logger {
    /**
     * Middleware to log request and response details, including request method, URL, body, and response status.
     * This also sanitizes the body for sensitive data and logs it accordingly.
     *
     * @param {Request} req - The incoming HTTP request object.
     * @param {Response} res - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middleware function in the stack.
     */
    logRequestAndResponse(req: Request, res: Response, next: NextFunction): void

    /**
     * Middleware to initialize context with a unique request ID.
     *
     * @param {Request} req - The incoming HTTP request object.
     * @param {Response} res - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middleware function in the stack.
     */
    contextMiddleware(req: Request, res: Response, next: NextFunction): void

    /**
     * Logs an informational message.
     * @param {any} message - The message to log.
     * @param {any} optionalParams - Optional params, such as JSON
     */
    info(message: any, ...optionalParams: any[]): void

    /**
     * Logs an error message.
     * @param {string} message - The error message to log.
     * @param {any} optionalParams - Optional params, such as JSON
     */
    error(message: any, ...optionalParams: any[]): void

    /**
     * Logs a warning message.
     * @param {string} message - The warning message to log.
     * @param {any} optionalParams - Optional params, such as JSON
     */
    warn(message: any, ...optionalParams: any[]): void

    /**
     * Logs a debug message, but only in development environment.
     * @param {string} message - The debug message to log.
     * @param {any} optionalParams - Optional params, such as JSON
     */
    debug(message: any, ...optionalParams: any[]): void

    /**
     * Sanitizes the body by redacting sensitive fields.
     * @param {any} body - The body to sanitize.
     * @returns {any} - The sanitized body with sensitive data redacted.
     */
    sanitizeBody(body: any): any
}

/* c8 ignore start */
export class AppLogger implements Logger {
    private asyncLocalStorage: AsyncLocalStorage<Map<string, string>>
    private dateTime: string
    private sensitiveFields: string[]
    private shouldRedact: boolean

    constructor(sensitiveFields: string[] = [], shouldRedact: boolean = true) {
        this.asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>()
        this.dateTime = new Date().toISOString()

        this.shouldRedact = shouldRedact

        // Assign the sensitive fields or use default values
        this.sensitiveFields = sensitiveFields.length > 0
            ? sensitiveFields
            : [
                "password",
                "confirmPassword",
                "token",
                "phone",
                "email",
                "receiverMobile",
                "name",
                "username",
                "authorization",
                "x-api-key"
            ]
    }

    contextMiddleware(req: Request, res: Response, next: NextFunction) {
        const requestId: string = uuidv4()
        this.asyncLocalStorage.run(new Map([["requestId", requestId]]), () => {
            (req as any).requestId = requestId
            res.set("X-Request-ID", requestId) // Attach request ID to the request object
            next()
        })
    }

    logRequestAndResponse(req: Request, res: Response, next: NextFunction): void {
        this.info(`Request ${req.method} ${req.url}`)

        if (this.shouldRedact) {
            this.info(`Request Headers`, this.sanitizeBody(req.headers))
        } else {
            this.info(`Request Headers`, req.headers)
        }

        if (req.method !== "GET") {
            // Handle JSON responses by sanitizing and stringifying
            if (this.shouldRedact) {
                this.info("Body:", this.sanitizeBody(req.body))
            } else {
                this.info(`Body:`, req.body)
            }
        }

        // Capture original send method to log response
        const originalSend = res.send.bind(res)
        res.send = function (body: any) {
            let sanitizedBody: string

            // Handle JSON responses by sanitizing and stringifying
            if (this.shouldRedact) {
                sanitizedBody = JSON.stringify(this.sanitizeBody(body))
            } else {
                sanitizedBody = body
            }

            // Add logging for response status and body after it’s processed
            if (res.statusCode >= 400) {
                this.error(`Response status: ${res.statusCode}`, sanitizedBody)
            } else {
                this.info(`Response: ${res.statusCode}`, sanitizedBody)
            }

            return originalSend(body)
        }.bind(this)  // Bind the logger instance to 'this'

        next()
    }

    info(message: any, ...optionalParams: any[]): void {
        const requestId = this.asyncLocalStorage.getStore()?.get("requestId") || "N/A"
        const callerInfo = this.getCallerInfo()
        console.info(
            `${COLORS.INFO}[${this.dateTime}] [INFO] ${callerInfo} RequestID: ${requestId} | ${message}`, optionalParams.length > 0 ? optionalParams : '', COLORS.RESET
        )
    }
    error(message: any, ...optionalParams: any[]): void {
        const requestId = this.asyncLocalStorage.getStore()?.get("requestId") || "N/A"
        const callerInfo = this.getCallerInfo()
        console.error(
            `${COLORS.ERROR}[${this.dateTime}] [ERROR] ${callerInfo} RequestID: ${requestId} | ${message}`, optionalParams.length > 0 ? optionalParams : '', COLORS.RESET
        )
    }
    warn(message: any, ...optionalParams: any[]): void {
        const requestId = this.asyncLocalStorage.getStore()?.get("requestId") || "N/A"
        const callerInfo = this.getCallerInfo()
        console.warn(
            `${COLORS.WARN}[${this.dateTime}] [WARN] ${callerInfo} RequestID: ${requestId} | ${message}`, optionalParams.length > 0 ? optionalParams : '', COLORS.RESET
        )
    }
    debug(message: any, ...optionalParams: any[]): void {
        if (!this.shouldRedact) {
            const requestId = this.asyncLocalStorage.getStore()?.get("requestId") || "N/A"
            const callerInfo = this.getCallerInfo()
            console.debug(
                `${COLORS.DEBUG}[${this.dateTime}] [DEBUG] ${callerInfo} RequestID: ${requestId} | ${message}`, optionalParams.length > 0 ? optionalParams : '', COLORS.RESET
            )
        }
    }

    /* c8 ignore stop */
    sanitizeBody(body: any): any {
        // If the body is a string, try parsing it as JSON
        if (typeof body === "string") {
            try {
                // Attempt to parse the string as JSON
                const parsedBody = JSON.parse(body)
                return this.sanitizeBody(parsedBody) // Recursively sanitize the parsed body
            } catch (e) {
                // If it's not valid JSON, return the original string (no sanitization)
                return body
            }
        }

        if (Array.isArray(body)) {
            return body.map(this.sanitizeBody.bind(this)) // Handle arrays
        }

        if (typeof body === "object" && body !== null) {
            const sanitizedObject: any = {}

            Object.keys(body).forEach((key) => {
                if (this.sensitiveFields.includes(key)) {
                    sanitizedObject[key] = "[REDACTED]" // Replace sensitive field with "[REDACTED]"
                } else {
                    sanitizedObject[key] = this.sanitizeBody(body[key]) // Recurse for nested objects
                }
            })

            return sanitizedObject
        }

        return body // Return the body as is if it's a primitive type
    }

    /* c8 ignore start */

    /**
    * Retrieves the file and line number of the caller of the function.
    * Uses the V8 Error stack trace to determine the caller's information.
    * @returns {string} An object containing the file and line number of the caller,
    *                   or 'Unknown file:0' if caller information couldn't be determined.
    */
    private getCallerInfo(): string {
        const error = new Error()
        const stack = error.stack?.split("\n")[3] // Get the 3rd line in the stack trace (caller)
        const match = stack?.match(/at .*\/([^/]+):(\d+):\d+/) // Extract file name and line number
        if (match) {
            const [, filename, line] = match
            return `[${filename}:${line}]`
        }
        return "[Unknown file:0]"
    }
}
/* c8 ignore stop */