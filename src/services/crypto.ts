import * as bcrypt from 'bcrypt'
import crypto from "crypto"
import jwt, { SignOptions } from "jsonwebtoken"
import { NextFunction } from "express"
import { EnvService } from "./env"
import { User } from "../repository/schema/user"

export interface CryptoService {
    /**
     * Generates a JWT token for the specified member based on their role.
     * The token includes the member's ID, role, and name, and is signed
     * with the application's secret key. The token's expiration time
     * depends on the member's role and configuration in the environment variables.
     *
     * @param {Object} user - The member for whom the token is being generated.
     * @param {string} terminal - The terminal or system requesting the token.
     * @returns {string} - The generated JWT token.
     * @throws {Error} - Throws if the member's role is invalid.
     */
    generateUserToken(user: User, terminal: string): string

    /**
     * Verifies the authenticity and validity of the provided JWT token.
     * This function checks if the token is valid, not expired, and signed correctly.
     *
     * @param {string} token - The JWT token to be verified.
     * @param {NextFunction} next - The callback function to handle the result of the verification.
     * @returns {void}
     * @throws {Error} - Throws if the token is invalid or expired.
     */
    verifyToken(token: string, next: NextFunction): void

    /**
     * Verifies the authenticity and validity of the provided JWT token 
     * using a custom secret key.
     *
     * @param {string} token - The JWT token to be verified.
     * @param {string} secret - The secret key to verify the token's signature.
     * @param {NextFunction} next - The callback function to handle the result of the verification.
     * @returns {void}
     * @throws {Error} - Throws if the token is invalid or expired.
     */
    verifyTokenWithSecret(token: string, secret: string, next: NextFunction): void

    /**
     * Compares a supplied password with an existing hashed password to check for a match.
     * This function uses a secure hashing algorithm to ensure passwords are checked safely.
     *
     * @param {string} supplied - The password provided by the user.
     * @param {string} existing - The existing hashed password to compare against.
     * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if the passwords match, `false` otherwise.
     */
    comparePassword(supplied: string, existing: string): Promise<boolean>

    /**
     * Generates a random password of the specified length and returns both the password and its hashed version.
     * The password is generated securely and is suitable for use in authentication systems.
     *
     * @param {number} length - The length of the password to generate.
     * @returns {Promise<{ password: string, hashed: string }>} - A promise that resolves to an object containing the plain password and its hashed version.
     */
    generateRandomPassword(length: number): Promise<{ password: string, hashed: string }>

    /**
     * Creates a secure hash from the provided signature text.
     * This is used to create consistent, irreversible signatures for sensitive data.
     *
     * @param {string} signatureText - The text to be hashed (e.g., a token, signature, or identifier).
     * @returns {string} - The generated hash of the provided signature text.
     */
    createHashText(signatureText: string): string

    /**
     * Hashes a given password using a secure hashing algorithm.
     * This is used to securely store and compare user passwords.
     *
     * @param {string} password - The password to be hashed (e.g., a user's password).
     * @returns {Promise<string>} - A promise that resolves to the hashed password string.
     * 
     * @throws {Error} - Throws an error if the hashing process fails.
     */
    hashPassword(password: string): Promise<string>

    /**
     * Encrypts the provided string using AES-256-CBC encryption algorithm.
     *
     * @param {string} data - The plain text data to encrypt.
     * @returns {string} - The encrypted data in hex format with IV prepended.
     */
    encryptAES(data: string): string

    /**
     * Decrypts the provided AES-encrypted string back to plain text.
     *
     * @param {string} encrypted - The encrypted data string.
     * @returns {string} - The original decrypted plain text.
     */
    decryptAES(encrypted: string): string
}


export class AppCryptoService implements CryptoService {

    constructor(private envService: EnvService) { }

    generateUserToken(user: User, terminal: string): string {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        // Secret key includes both the base JWT secret and the terminal info.
        const secretKey: string = `${this.envService.jwtSecret}^${terminal}`

        // TODO: create token with private key
        const options: SignOptions = { expiresIn: '1h', algorithm: "HS256" }

        return jwt.sign(payload, secretKey, options)
    }

    verifyToken(token: string, next: NextFunction) {
        const secretKey: string = this.envService.jwtSecret

        try {
            // Verify the token
            let user = jwt.verify(token, secretKey)
            next(user)
        } catch (error) {
            // Handle token errors specifically
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token has expired')
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new Error(`Invalid token ${error.message}`)
            } else {
                throw new Error(`Token verification failed ${error.message}`)
            }
        }
    }

    verifyTokenWithSecret(token: string, secret: string, next: NextFunction): void {
        try {
            // Verify the token
            let user = jwt.verify(token, secret)
            next(user)
        } catch (error) {
            // Handle token errors specifically
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token has expired')
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid token')
            } else {
                throw new Error('Token verification failed')
            }
        }
    }

    async comparePassword(supplied: string, existing: string): Promise<boolean> {
        return await bcrypt.compare(supplied, existing)
    }

    async generateRandomPassword(length: number = 12): Promise<{ password: string, hashed: string }> {
        // Define character sets for password generation
        const lowercase = 'abcdefghijklmnopqrstuvwxyz'
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const numbers = '0123456789'
        const symbols = '!@#$%^&*-_'

        // Combine all character sets into one string
        const allCharacters = lowercase + uppercase + numbers + symbols

        // Generate the password by randomly picking characters from the combined set
        let password = ''
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allCharacters.length)
            password += allCharacters[randomIndex]
        }

        const hashed = await bcrypt.hash(password, 10)

        // Return both the password and its hashed version
        return { password, hashed }
    }

    createHashText(signatureText: string): string {
        // Create hash from the signature text
        const hash = crypto.createHash("sha256")
        const output = hash.update(signatureText, "utf8").digest()
        let hashText = output.toString("hex")

        // Ensure the hash length is 64 characters
        while (hashText.length < 64) {
            hashText = "0" + hashText
        }

        return hashText
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }

    encryptAES(data: string): string {
        const algorithm = 'aes-256-cbc'
        const secretKey = Buffer.from(this.envService.encryptionKey!, 'hex')
        const iv = crypto.randomBytes(16)

        const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
        let encrypted = cipher.update(data, 'utf8', 'hex')
        encrypted += cipher.final('hex')

        return iv.toString('hex') + ':' + encrypted
    }

    decryptAES(encrypted: string): string {
        const algorithm = 'aes-256-cbc'
        const secretKey = Buffer.from(this.envService.encryptionKey!, 'hex')

        const [ivHex, encryptedData] = encrypted.split(':')
        const iv = Buffer.from(ivHex, 'hex')

        const decipher = crypto.createDecipheriv(algorithm, secretKey, iv)
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
        decrypted += decipher.final('utf8')

        return decrypted
    }
}