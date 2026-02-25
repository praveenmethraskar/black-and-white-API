export interface ApiError {
    code?: string
    message: string
    statusCode: number
    details?: any
}

export class APIError extends Error {
    code?: string
    statusCode: number
    details: any

    constructor({ code, message, statusCode, details }: ApiError, customMessage?: string) {
        const finalMessage = customMessage || message || 'An unknown error occurred'
        super(finalMessage)
        this.name = this.constructor.name
        this.code = code
        this.statusCode = statusCode
        this.details = details || undefined
    }
}