import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticatedData } from '../model/authenticateddata'
import { SupportRole } from '../model/enums/supportRole'


export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            code: 'AUTH01',
            message: 'No token provided. Please log in.'
        })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const secret = process.env.JWT_SECRET!
        const decoded = jwt.verify(token, secret) as AuthenticatedData
        req.user = decoded
        next()
    } catch (err) {
        const message = err instanceof jwt.TokenExpiredError
            ? 'Token has expired. Please log in again.'
            : 'Invalid token. Please log in.'

        res.status(401).json({
            success: false,
            code: 'AUTH02',
            message
        })
    }
}

export const authorize = (...roles: SupportRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthenticated' })
            return
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                code: 'U01',
                message: 'You do not have permission to access this resource.'
            })
            return
        }

        next()
    }
}