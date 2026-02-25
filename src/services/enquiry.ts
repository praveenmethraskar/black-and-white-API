import { EnquiryRepository } from '../repository/enquiry'
import { EnquiryRequest } from '../model/request/EnquiryRequest'
import { EnquiryResponse } from '../model/response/EnquiryResponse'
import { APIError } from '../errors/api'

export class EnquiryService {

    constructor(private enquiryRepository: EnquiryRepository) { }

    async createEnquiry(data: EnquiryRequest): Promise<EnquiryResponse> {
        const enquiry = await this.enquiryRepository.create(data)

        const id = (enquiry._id as unknown as { toString(): string }).toString()

        return {
            id,
            name: enquiry.name,
            email: enquiry.email,
            phone: enquiry.phone,
            location: enquiry.location,
            message: enquiry.message,
            createdAt: enquiry.createdAt
        }
    }

    async getAllEnquiries(): Promise<EnquiryResponse[]> {
        const enquiries = await this.enquiryRepository.findAll()

        return enquiries.map(enquiry => {
            const id = (enquiry._id as unknown as { toString(): string }).toString()
            return {
                id,
                name: enquiry.name,
                email: enquiry.email,
                phone: enquiry.phone,
                location: enquiry.location,
                message: enquiry.message,
                createdAt: enquiry.createdAt
            }
        })
    }

    async getEnquiryById(id: string): Promise<EnquiryResponse> {
        const enquiry = await this.enquiryRepository.findById(id)

        if (!enquiry) {
            throw new APIError({
                code: 'E01',
                message: 'Enquiry not found',
                statusCode: 404
            })
        }

        const enquiryId = (enquiry._id as unknown as { toString(): string }).toString()

        return {
            id: enquiryId,
            name: enquiry.name,
            email: enquiry.email,
            phone: enquiry.phone,
            location: enquiry.location,
            message: enquiry.message,
            createdAt: enquiry.createdAt
        }
    }
}