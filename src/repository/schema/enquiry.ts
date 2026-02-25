import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export interface Enquiry extends Document {
    id: ObjectId
    name: string
    email: string
    phone: string
    location: string
    message: string
    createdAt: Date
    updatedAt: Date
}

const enquirySchema = new Schema<Enquiry>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            minlength: 10
        }
    },
    { timestamps: true }
)

export const EnquirySchema = mongoose.model<Enquiry>('Enquiry', enquirySchema)