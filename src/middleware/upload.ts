import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs'
import { Request } from 'express'

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'resumes')
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

// Allowed MIME types for resume
const ALLOWED_MIME_TYPES = [
    'application/pdf',                                                        // .pdf
    'application/msword',                                                     // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
]

// Storage config — saves file to uploads/resumes/ with unique name
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR)
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
        const ext = path.extname(file.originalname)
        cb(null, `resume-${uniqueSuffix}${ext}`)
    }
})

// File filter — only allow PDF and Word documents
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only PDF and Word documents (.pdf, .doc, .docx) are allowed.'))
    }
}

export const uploadResume = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5 MB max
    }
}).single('resume')   // field name in form-data must be "resume"