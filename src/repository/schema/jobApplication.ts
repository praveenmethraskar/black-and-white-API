import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export interface JobApplication extends Document {
    id: ObjectId
    name: string
    email: string
    phone: string
    currentCity: string
    position: string
    description: string
    resume: {
        originalName: string
        path: string        // file stored here on disk
        mimeType: string
    }
    createdAt: Date
    updatedAt: Date
}

const jobApplicationSchema = new Schema<JobApplication>(
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
            required: [true, 'Mobile number is required'],
            trim: true
        },
        currentCity: {
            type: String,
            required: [true, 'Current city is required'],
            trim: true
        },
        position: {
            type: String,
            required: [true, 'Position is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: 10
        },
        resume: {
            originalName: { type: String, required: true },
            path: { type: String, required: true },   // disk path stored in DB
            mimeType: { type: String, required: true }
        }
    },
    { timestamps: true }
)

export const JobApplicationSchema = mongoose.model<JobApplication>('JobApplication', jobApplicationSchema)