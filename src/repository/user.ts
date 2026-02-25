import { User, UserSchema } from './schema/user'

export interface UserRepository{
findByEmail(email: string): Promise<User | null>

findById(id: string): Promise<User | null>

updateLastLogin(id: string): Promise<void> 
}

export class AppUserRepository implements UserRepository {

    async findByEmail(email: string): Promise<User | null> {
        return UserSchema.findOne({ email: email.toLowerCase().trim() })
    }

    async findById(id: string): Promise<User | null> {
        return UserSchema.findById(id)
    }

    async updateLastLogin(id: string): Promise<void> {
        await UserSchema.findByIdAndUpdate(id, { lastLogin: new Date() })
    }

    async create(data: Partial<User>): Promise<User> {
        const user = new UserSchema(data)
        return user.save()
    }
}