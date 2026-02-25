import { Request, Response } from 'express'
import { JobApplicationService } from '../services/jobApplication'
import { APIError } from '../errors/api'
import validator from 'validator'
import fs from 'fs'
import path from 'path'

// Allowed file types
const ALLOWED_MIME_TYPES: Record<string, string> = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
}

// Ensure upload folder exists
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'resumes')
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export class JobApplicationController {

    constructor(private jobApplicationService: JobApplicationService) { }

    // POST /api/job-application — public, no auth
    // Accepts JSON body with resume as base64 string
    async createApplication(req: Request, res: Response): Promise<void> {
        const { name, email, phone, currentCity, position, description, resume } = req.body

        // ── Validate fields ───────────────────────────────────────────────────
        const errors: string[] = []

        if (!name || typeof name !== 'string' || name.trim().length < 2)
            errors.push('Name is required (min 2 characters).')
        if (!email || !validator.isEmail(email))
            errors.push('A valid email address is required.')
        if (!phone || typeof phone !== 'string' || phone.trim().length < 7)
            errors.push('A valid mobile number is required.')
        if (!currentCity || typeof currentCity !== 'string' || currentCity.trim().length < 2)
            errors.push('Current city is required.')
        if (!position || typeof position !== 'string' || position.trim().length < 2)
            errors.push('Position to apply for is required.')
        if (!description || typeof description !== 'string' || description.trim().length < 10)
            errors.push('Description is required (min 10 characters).')

        // Resume object validation
        if (!resume) {
            errors.push('Resume is required.')
        } else {
            if (!resume.originalName || typeof resume.originalName !== 'string')
                errors.push('resume.originalName is required (e.g. "my-cv.pdf").')
            if (!resume.mimeType || !ALLOWED_MIME_TYPES[resume.mimeType])
                errors.push('resume.mimeType must be application/pdf, application/msword, or application/vnd.openxmlformats-officedocument.wordprocessingml.document.')
            if (!resume.base64 || typeof resume.base64 !== 'string')
                errors.push('resume.base64 is required (base64 encoded file content).')
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

        // ── Decode base64 and save file to disk ───────────────────────────────
        try {
            const ext = ALLOWED_MIME_TYPES[resume.mimeType]
            const uniqueName = `resume-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
            const filePath = path.join(UPLOAD_DIR, uniqueName)

            // Validate base64 string and write to disk
            const fileBuffer = Buffer.from(resume.base64, 'base64')

            // Check file size (5MB limit)
            if (fileBuffer.length > 5 * 1024 * 1024) {
                res.status(400).json({
                    success: false,
                    code: 'FILE02',
                    message: 'Resume file size must not exceed 5MB.'
                })
                return
            }

            fs.writeFileSync(filePath, fileBuffer)

            // ── Save to DB ────────────────────────────────────────────────────
            const result = await this.jobApplicationService.createApplication({
                name,
                email,
                phone,
                currentCity,
                position,
                description,
                resumePath: filePath,
                resumeOriginalName: resume.originalName,
                resumeMimeType: resume.mimeType
            })

            res.status(201).json({
                success: true,
                message: 'Application submitted successfully. We will review and get back to you!',
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
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // GET /api/job-application — admin only
    async getAllApplications(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.jobApplicationService.getAllApplications()
            res.status(200).json({ success: true, data: result })
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // GET /api/job-application/:id/resume — download resume file
    async downloadResume(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string
            const application = await this.jobApplicationService.getApplicationById(id)

            res.download(application.resume.path, application.resume.originalName, (err) => {
                if (err && !res.headersSent) {
                    res.status(404).json({
                        success: false,
                        message: 'Resume file not found on server.'
                    })
                }
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
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}