import { Request, Response } from 'express'
import { EnquiryService } from '../services/enquiry'
import { APIError } from '../errors/api'

export class EnquiryController {

    constructor(private enquiryService: EnquiryService) {}

    // POST /api/enquiry  — public, no auth
    async createEnquiry(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.enquiryService.createEnquiry(req.body)

            res.status(201).json({
                success: true,
                message: 'Enquiry submitted successfully. We will get back to you soon!',
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

    // GET /api/enquiry  — protected (admin dashboard)
    async getAllEnquiries(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.enquiryService.getAllEnquiries()

            res.status(200).json({
                success: true,
                data: result
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

    // GET /api/enquiry/:id
    async getEnquiryById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string  // Express 5: params are string | string[]

            const result = await this.enquiryService.getEnquiryById(id)

            res.status(200).json({
                success: true,
                data: result
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
}