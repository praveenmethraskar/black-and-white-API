import { SupportRole } from '../enums/supportRole'

export interface LoginResponse {
    token: string
    user: {
        id: string
        name: string
        email: string
        role: SupportRole
        lastLogin?: Date
    }
}