import mongoose, { Document, ObjectId, Schema } from 'mongoose'
import { SupportRole } from '../../model/enums/supportRole'

export interface User extends Document {
    id: ObjectId
    name: string
    email: string
    password: string
    role: SupportRole
    isActive: boolean
    lastLogin?: Date
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<User>(
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
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 8
        },
        role: {
            type: Number,
            enum: Object.values(SupportRole).filter(v => typeof v === 'number'),
            default: SupportRole.SUPPORT
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date
        }
    },
    { timestamps: true }
)

export const UserSchema = mongoose.model<User>('User', userSchema)