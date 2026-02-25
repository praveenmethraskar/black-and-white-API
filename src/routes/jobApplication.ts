import { Request, Response } from 'express'
import { route, POST, GET, before } from 'awilix-express'
import { JobApplicationController } from '../controllers/jobApplication'
import { authenticate, authorize } from '../middleware/auth'
import { SupportRole } from '../model/enums/supportRole'

@route('/api/job-application')
export class JobApplicationRoutes {
    constructor(private jobApplicationController: JobApplicationController) {}

    // POST /api/job-application — public, no auth
    // multer upload + validation handled inside controller.createApplication
    @route('/')
    @POST()
    async createApplication(req: Request, res: Response): Promise<void> {
        await this.jobApplicationController.createApplication(req, res)
    }

    // GET /api/job-application — admin only
    @route('/')
    @GET()
    @before([authenticate, authorize(SupportRole.SUPER_ADMIN, SupportRole.ADMIN)])
    async getAllApplications(req: Request, res: Response): Promise<void> {
        await this.jobApplicationController.getAllApplications(req, res)
    }

    // GET /api/job-application/:id/resume — download resume file, admin only
    @route('/:id/resume')
    @GET()
    @before([authenticate, authorize(SupportRole.SUPER_ADMIN, SupportRole.ADMIN)])
    async downloadResume(req: Request, res: Response): Promise<void> {
        await this.jobApplicationController.downloadResume(req, res)
    }
}