import { Request, Response, NextFunction } from "express"
import { CryptoService } from "../services/crypto"
import { EnvService } from "../services/env"
import { AuthenticatedData } from "../model/authenticateddata"

export interface AuthMiddleware {
    /**
     * Middleware to authenticate a JWT token.
     * This middleware checks if the request contains a valid JWT token,
     * verifies its authenticity, and proceeds to the next middleware or request handler
     * if the token is valid. If the token is missing or invalid, it sends an error response.
     *
     * @param {Request} req - The incoming HTTP request object.
     * @param {Response} res - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middleware function in the stack.
     * @returns {void} - Continues to the next middleware or returns an error if the token is invalid.
     */
    authenticateToken(req: Request, res: Response, next: NextFunction): void

}

export class AppAuthMiddleware implements AuthMiddleware {
    /**
     * Initializes the authentication middleware with the necessary services.
     * @param cryptoService - Service for handling cryptographic operations (e.g., verifying JWT tokens).
     * @param envService - Service which provides env related data.
     * @param terminalService - Service for accessing terminal data.
     */
    constructor(
        public cryptoService: CryptoService,
        public envService: EnvService,
    ) { }

    authenticateToken(req: Request, res: Response, next: NextFunction): Response | void {

        const token = req.headers["authorization"]?.split(" ")[1]

        if (!token) {
            return res.sendStatus(401)
        }

        try {
            const terminalId = req.headers["x-api-key"] as string | undefined
            const secret = terminalId ? `${this.envService.jwtSecret}^${terminalId}` : this.envService.jwtSecret
            this.cryptoService.verifyTokenWithSecret(token, secret, (user: any) => {
                next(user)
            })
        } catch (error) {
            if (error instanceof Error) return res.status(401).json({ message: error.message })
            return res.status(500).json({ error })
        }
    }

}