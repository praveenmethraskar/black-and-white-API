import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

export const validateEnquiryRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { name, email, phone, location, message } = req.body
    const errors: string[] = []

    // Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters.')
    }

    // Email
    if (!email || typeof email !== 'string') {
        errors.push('Email is required.')
    } else if (!validator.isEmail(email)) {
        errors.push('Please provide a valid email address.')
    }

    // Phone
    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
        errors.push('A valid mobile number is required.')
    }

    // Location
    if (!location || typeof location !== 'string' || location.trim().length < 2) {
        errors.push('Location is required.')
    }

    // Message
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
        errors.push('Message is required and must be at least 10 characters.')
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            code: 'VAL02',
            message: 'Validation failed',
            details: errors
        })
        return
    }

    next()
}