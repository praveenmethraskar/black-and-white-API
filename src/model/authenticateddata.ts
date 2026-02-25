import { SupportRole } from './enums/supportRole'

export interface AuthenticatedData {
    userId: string
    email: string
    name: string
    role: SupportRole
    iat?: number
    exp?: number
}