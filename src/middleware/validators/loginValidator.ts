import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

export const validateLoginRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body
    const errors: string[] = []

    if (!email || typeof email !== 'string') {
        errors.push('Email is required.')
    } else if (!validator.isEmail(email)) {
        errors.push('Please provide a valid email address.')
    }

    if (!password || typeof password !== 'string') {
        errors.push('Password is required.')
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters.')
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            code: 'VAL01',
            message: 'Validation failed',
            details: errors
        })
        return
    }

    next()
}