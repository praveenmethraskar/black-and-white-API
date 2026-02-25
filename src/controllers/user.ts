import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/user'
import { APIError } from '../errors/api'
import { AuthenticatedData } from '../model/authenticateddata'

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedData
        }
    }
}

export class UserController {
    constructor(private userService: UserService) {}

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userService.login(req.body)

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            })
        } catch (err) {
            if (err instanceof APIError) {
                res.status(err.statusCode).json({
                    success: false,
                    code: err.code,
                    message: err.message,
                    details: err.details
                })
                return
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const profile = await this.userService.getProfile(req.user!.userId)

            res.status(200).json({
                success: true,
                data: profile
            })
        } catch (err) {
            if (err instanceof APIError) {
                res.status(err.statusCode).json({
                    success: false,
                    code: err.code,
                    message: err.message
                })
                return
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async adminOnly(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            success: true,
            message: `Welcome, ${req.user!.name}. You have admin access.`,
            role: req.user!.role
        })
    }
}