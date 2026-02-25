import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

export const validateJobApplicationRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { name, email, phone, currentCity, position, description } = req.body
    const errors: string[] = []

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters.')
    }

    if (!email || typeof email !== 'string') {
        errors.push('Email is required.')
    } else if (!validator.isEmail(email)) {
        errors.push('Please provide a valid email address.')
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
        errors.push('A valid mobile number is required.')
    }

    if (!currentCity || typeof currentCity !== 'string' || currentCity.trim().length < 2) {
        errors.push('Current city is required.')
    }

    if (!position || typeof position !== 'string' || position.trim().length < 2) {
        errors.push('Position to apply for is required.')
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
        errors.push('Description is required and must be at least 10 characters.')
    }

    if (!req.file) {
        errors.push('Resume is required. Please upload a PDF or Word document.')
    }

    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            code: 'VAL03',
            message: 'Validation failed',
            details: errors
        })
        return
    }

    next()
}