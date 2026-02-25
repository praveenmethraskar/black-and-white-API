import { JobApplication, JobApplicationSchema } from './schema/jobApplication'
import { JobApplicationRequest } from '../model/request/jobApplication'

export interface JobApplicationRepository {
    create(data: JobApplicationRequest): Promise<JobApplication>
    findAll(): Promise<JobApplication[]>
    findById(id: string): Promise<JobApplication | null>
}

export class AppJobApplicationRepository implements JobApplicationRepository {

    async create(data: JobApplicationRequest): Promise<JobApplication> {
        const application = new JobApplicationSchema({
            name: data.name,
            email: data.email,
            phone: data.phone,
            currentCity: data.currentCity,
            position: data.position,
            description: data.description,
            resume: {
                originalName: data.resumeOriginalName,
                path: data.resumePath,
                mimeType: data.resumeMimeType
            }
        })
        return application.save()
    }

    async findAll(): Promise<JobApplication[]> {
        return JobApplicationSchema.find().sort({ createdAt: -1 })
    }

    async findById(id: string): Promise<JobApplication | null> {
        return JobApplicationSchema.findById(id)
    }
}