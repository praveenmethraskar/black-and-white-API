import { ApiError } from "./api";


// SUPPORT_USER_ERRORS using the ApiError interface
export const SUPPORT_USER_ERRORS: Record<string, ApiError> = {
    INVALID_ROLE: {
        code: "I01",
        message: "Invalid Role",
        statusCode: 404,
      },
    UNAUTHORIZED_ROLE: {
        code: "U01",
        message: 'Unauthorized Role',
        statusCode: 404,
    },
    USER_NOT_FOUND: {
        code: 'U02',
        message: 'User not found',
        statusCode: 404
    }
}