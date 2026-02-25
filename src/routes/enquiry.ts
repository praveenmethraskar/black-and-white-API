import { Request, Response, NextFunction } from 'express'
import { route, POST, GET, before } from 'awilix-express'
import { EnquiryController } from '../controllers/enquiry'
import { validateEnquiryRequest } from '../middleware/validators/enquiryValidator'
import { authenticate, authorize } from '../middleware/auth'
import { SupportRole } from '../model/enums/supportRole'

@route('/api/enquiry')
export class EnquiryRoutes {
    constructor(private enquiryController: EnquiryController) {}

    // POST /api/enquiry  — public, no auth required
    @route('/')
    @POST()
    @before([validateEnquiryRequest])
    async createEnquiry(req: Request, res: Response): Promise<void> {
        await this.enquiryController.createEnquiry(req, res)
    }

    // GET /api/enquiry  — protected: admin & super admin only
    @route('/')
    @GET()
    @before([authenticate, authorize(SupportRole.SUPER_ADMIN, SupportRole.ADMIN)])
    async getAllEnquiries(req: Request, res: Response): Promise<void> {
        await this.enquiryController.getAllEnquiries(req, res)
    }

    // GET /api/enquiry/:id  — protected: admin & super admin only
    @route('/:id')
    @GET()
    @before([authenticate, authorize(SupportRole.SUPER_ADMIN, SupportRole.ADMIN)])
    async getEnquiryById(req: Request, res: Response): Promise<void> {
        await this.enquiryController.getEnquiryById(req, res)
    }
}