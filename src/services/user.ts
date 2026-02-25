import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthenticatedData } from '../model/authenticateddata'
import { APIError } from '../errors/api'
import { SUPPORT_USER_ERRORS } from '../errors/user'
import { UserRepository } from '../repository/user'
import { LoginResponse } from '../model/response/login'
import { LoginRequest } from '../model/request/login'

export class UserService {
    private userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async login(data: LoginRequest): Promise<LoginResponse> {
        const { email, password } = data

        const user = await this.userRepository.findByEmail(email)
        if (!user) {
            throw new APIError({
                code: 'U04',
                message: 'Invalid email or password',
                statusCode: 401
            })
        }

        if (!user.isActive) {
            throw new APIError({
                code: 'U03',
                message: 'Account is deactivated. Please contact support.',
                statusCode: 403
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new APIError({
                code: 'U04',
                message: 'Invalid email or password',
                statusCode: 401
            })
        }

        const userId = (user._id as unknown as { toString(): string }).toString()

        const payload: AuthenticatedData = {
            userId,
            email: user.email,
            name: user.name,
            role: user.role
        }

        const secret = process.env.JWT_SECRET!
        const expiresIn = process.env.JWT_EXPIRES_ADMIN || '1h'
        const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions)

        this.userRepository.updateLastLogin(userId).catch(() => {})

        return {
            token,
            user: {
                id: userId,
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            }
        }
    }

    async getProfile(userId: string) {
        const user = await this.userRepository.findById(userId)
        if (!user) {
            throw new APIError(SUPPORT_USER_ERRORS.USER_NOT_FOUND)
        }

        const id = (user._id as unknown as { toString(): string }).toString()

        return {
            id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        }
    }
}