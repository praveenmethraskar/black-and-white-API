import { JobApplicationRepository } from '../repository/jobApplication'
import { JobApplicationRequest } from '../model/request/jobApplication'
import { JobApplicationResponse } from '../model/response/jobApplication'
import { APIError } from '../errors/api'

export class JobApplicationService {

    constructor(private jobApplicationRepository: JobApplicationRepository) {}

    async createApplication(data: JobApplicationRequest): Promise<JobApplicationResponse> {
        const application = await this.jobApplicationRepository.create(data)
        return this.toResponse(application)
    }

    async getAllApplications(): Promise<JobApplicationResponse[]> {
        const applications = await this.jobApplicationRepository.findAll()
        return applications.map(app => this.toResponse(app))
    }

    async getApplicationById(id: string): Promise<JobApplicationResponse> {
        const application = await this.jobApplicationRepository.findById(id)

        if (!application) {
            throw new APIError({
                code: 'JA01',
                message: 'Job application not found',
                statusCode: 404
            })
        }

        return this.toResponse(application)
    }

    private toResponse(application: any): JobApplicationResponse {
        const id = (application._id as unknown as { toString(): string }).toString()
        return {
            id,
            name: application.name,
            email: application.email,
            phone: application.phone,
            currentCity: application.currentCity,
            position: application.position,
            description: application.description,
            resume: {
                originalName: application.resume.originalName,
                path: application.resume.path,
                mimeType: application.resume.mimeType
            },
            createdAt: application.createdAt
        }
    }
}