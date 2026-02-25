import { Enquiry, EnquirySchema } from './schema/enquiry'
import { EnquiryRequest } from '../model/request/EnquiryRequest'

export interface EnquiryRepository {
    create(data: EnquiryRequest): Promise<Enquiry>
    findAll(): Promise<Enquiry[]>
    findById(id: string): Promise<Enquiry | null>
}

export class AppEnquiryRepository implements EnquiryRepository {

    async create(data: EnquiryRequest): Promise<Enquiry> {
        const enquiry = new EnquirySchema(data)
        return enquiry.save()
    }

    async findAll(): Promise<Enquiry[]> {
        return EnquirySchema.find().sort({ createdAt: -1 })
    }

    async findById(id: string): Promise<Enquiry | null> {
        return EnquirySchema.findById(id)
    }
}