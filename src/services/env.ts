import { configDotenv } from "dotenv"

/**
 * Interface defining the configuration properties required for the application's environment settings.
 * These settings include application environment, ports, database configuration, JWT secrets, and various 
 * external service credentials like email and SMS configuration.
 */
export interface EnvService {
    /**
     * The current environment in which the application is running (e.g., "development", "production").
     * This property is typically used to control environment-specific configurations.
     * 
     * @type {string}
     */
    nodeEnv: string

    /**
     * The port on which the application should listen for incoming requests.
     * 
     * @type {number}
     */
    port: number

    /**
     * The URL to connect to the application's database.
     * This URL includes necessary information like the database type, host, and credentials.
     * 
     * @type {string}
     */
    databaseUrl: string

    /**
     * The secret key used to sign and verify JWT (JSON Web Tokens) for authentication.
     * This key should be kept secure and is used for all JWT operations.
     * 
     * @type {string}
     */
    jwtSecret: string

    /**
     * The encryption key used to encrypt the data.
     */
    encryptionKey: string

    /**
     * The expiration time for JWT tokens issued to admin users. 
     * Defines how long the admin JWT token remains valid before expiration.
     * 
     * @type {string}
     */
    jwtExpAdmin: string

    /**
     * The expiration time for JWT tokens issued to manager users.
     * Defines how long the manager JWT token remains valid before expiration.
     * 
     * @type {string}
     */
    jwtExpManager: string

    /**
     * The expiration time for JWT tokens issued to super admin users.
     * Defines how long the super admin JWT token remains valid before expiration.
     * 
     * @type {string}
     */
    jwtExpSuperAdmin: string

    /**
     * The expiration time for JWT tokens issued to regular users.
     * Defines how long the user JWT token remains valid before expiration.
     * 
     * @type {string}
     */
    jwtExpUser: string

    // Email Configuration
    /**
     * The username used to authenticate with the SMTP server for sending emails.
     * 
     * @type {string}
     */
    smtpUser: string

    /**
     * The SMTP key or password used to authenticate with the SMTP server for sending emails.
     * 
     * @type {string}
     */
    smtpKey: string

    /**
     * The Zepto mail key used to authenticate with the zepto mail server for sending emails.
     * 
     * @type {string}
     */
    mailerKey: string

    /**
     * The hostname or IP address of the SMTP server used to send emails.
     * 
     * @type {string}
     */
    smtpHost: string

    /**
     * The port number used to connect to the SMTP server.
     * Commonly used ports for SMTP are 25, 465, or 587.
     * 
     * @type {number}
     */
    smtpPort: number

    /**
     * The email address used as the sender in outgoing messages.
     * Typically shown as the "From" address in recipients' inboxes.
     * 
     * @type {string}
     */
    senderEmail: string

    // Text message (SMS) Configuration
    /**
     * The hostname or IP address of the SMS service provider's API.
     * 
     * @type {string}
     */
    messageHostName: string

    /**
     * The path/URL to the SMS API endpoint for sending messages.
     * 
     * @type {string}
     */
    messagePathUrl: string

    /**
     * The API key used to authenticate requests to the SMS service provider.
     * 
     * @type {string}
     */
    msg91Key: string

    /**
     * The MSG91 template ID used for sending OTP messages during user authentication flows.
     * This includes OTPs sent for customer registration, customer login, vendor registration,
     * and vendor login via terminal.
     * 
     * @type {string}
     */
    msg91OtpTemplateId: string

    /**
     * The status notify url used to face id & no face id terminals.
     */
    sprintsafeStatusNotifyUrl: string

    /**
     * The status notify url used to freshkart terminals.
     */
    freshkartStatusNotifyUrl: string

    // Payment related credentials.
    /**
     * The Clinet Id of the payment related oeprations.
     */
    phonePeClinetId: string

    /**
     * The client secret of the payment related oeprations.
     */
    phonePeClientSecret: string

    /**
     * The merchant Id of the payment related operations.
     */
    phonePeMerchantId: string

    /**
     * The username of the sprintsafe related operations.
     */
    phonePeSprintsafeUsername: string

    /**
     * The password of the sprintsafe related operations.
     */
    phonePeSprintsafePassword: string

    /**
     * The username of the freshkart related operations.
     */
    phonePeFreshKartUsername: string

    /**
     * The password of the freshkart related operations.
     */
    phonePeFreshKartPassword: string

    /**
     * The base url for the payment related operations.
     */
    phonePeBaseUrl: string

    /**
     * The auth url for the payment authorization.
     */
    phonePeAuthUrl: string

    /**
     * The token url for generation of the token.
     */
    phonePeTokenUrl: string

    /**
     * The url which is responsible for creating the order token for payment related oeprations.
     */
    phonePeCreateOrderUrl: string

    /**
     * The url which is resposible for fetching the payment status from payment gateway.
     */
    phonePeCheckOrderStatusUrl: string

    /**
     * The payment deduction information associated with the franchise.
     * @type {any}
     */
    paymentDeduction: string
}

export class AppEnvService implements EnvService {
    constructor() {
        configDotenv()
    }

    public get nodeEnv(): string {
        return this.get<string>('NODE_ENV', true)
    }

    public get port(): number {
        return this.get<number>('PORT', true)
    }

    public get databaseUrl(): string {
        return this.get<string>('MONGO_URI', true)
    }

    public get jwtSecret(): string {
        return this.get<string>('JWT_SECRET', true)
    }

    public get encryptionKey(): string {
        return this.get<string>('ENCRYPTION_KEY', true)
    }

    public get jwtExpAdmin(): string {
        return this.get<string>('JWT_EXPIRES_ADMIN', false, '1h')
    }

    public get jwtExpManager(): string {
        return this.get<string>('JWT_EXPIRES_MANAGER', false, '1h')
    }

    public get jwtExpSuperAdmin(): string {
        return this.get<string>('JWT_EXPIRES_SUPER_ADMIN', false, '1h')
    }

    public get jwtExpUser(): string {
        return this.get<string>('JWT_EXPIRES_USER', false, '1h')
    }

    public get smtpUser(): string {
        return this.get<string>('SMTP_USER', true)
    }

    public get smtpKey(): string {
        return this.get<string>('SMTP_SERVICE_KEY', true)
    }

    public get mailerKey(): string {
        return this.get<string>('ZEPTO_SERVICE_KEY', true)
    }

    public get smtpHost(): string {
        return this.get<string>('SMTP_HOST', true)
    }

    public get smtpPort(): number {
        return this.get<number>('SMTP_PORT', true)
    }

    public get senderEmail(): string {
        return this.get<string>('SENDER_EMAIL', true)
    }

    public get messageHostName(): string {
        return this.get<string>('MSG_HOST_NAME', true)
    }

    public get messagePathUrl(): string {
        return this.get<string>('MSG_PATH_URL', true)
    }

    public get msg91Key(): string {
        return this.get<string>('MSG91_AUTH_KEY', true)
    }

     public get msg91OtpTemplateId(): string {
        return this.get<string>('MSG91_OTP_TEMPLATE_ID', true)
    }

    public get sprintsafeStatusNotifyUrl(): string {
        return this.get<string>('STATUS_NOTIFY_URL_SPRINTSAFE', false)
    }

    public get freshkartStatusNotifyUrl(): string {
        return this.get<string>('STATUS_NOTIFY_URL_FRESHKART', false)
    }

    public get phonePeClinetId(): string {
        return this.get<string>('PHONE_PE_CLIENT_ID', true)
    }

    public get phonePeClientSecret(): string {
        return this.get<string>('PHONE_PE_CLIENT_SECRET', true)
    }

    public get phonePeMerchantId(): string {
        return this.get<string>('PHONE_PE_MERCHANT_ID', true)
    }

    public get phonePeSprintsafeUsername(): string {
        return this.get<string>('PHONE_PE_SPRINTSAFE_USERNAME', true)
    }

    public get phonePeSprintsafePassword(): string {
        return this.get<string>('PHONE_PE_SPRINTSAFE_PASSWORD', true)
    }

    public get phonePeFreshKartUsername(): string {
        return this.get<string>('PHONE_PE_FRESHKART_USERNAME', true)
    }

    public get phonePeFreshKartPassword(): string {
        return this.get<string>('PHONE_PE_FRESHKART_PASSWORD', true)
    }

    public get phonePeBaseUrl(): string {
        return this.get<string>('PHONE_PE_BASE_URL', true)
    }

    public get phonePeAuthUrl(): string {
        return this.get<string>('PHONE_PE_AUTH_URL', true)
    }

    public get phonePeTokenUrl(): string {
        return this.get<string>('PHONE_PE_TOKEN_URL', true)
    }

    public get phonePeCreateOrderUrl(): string {
        return this.get<string>('PHONE_PE_CREATE_ORDER_URL', true)
    }

    public get phonePeCheckOrderStatusUrl(): string {
        return this.get<string>('PHONE_PE_CHECK_ORDER_STATUS_URL', true)
    }

    public get paymentDeduction(): string {
        return this.get<string>('DEFAULT_PAYMENT_DEDUCTION', false, '2')
    }
    /**
     * Get the value of the environment variable.
     * Throws an error if the variable is required but not set.
     * 
     * @template T The expected type of the environment variable
     * @param {boolean} [required=false] Whether the variable is required
     * @param {T} [defaultValue] The default value to return if not found
     * @returns {T} The value of the environment variable
     */
    get<T>(name: string, required: boolean = false, defaultValue?: T): T {
        const value = process.env[name]

        if (value === undefined) {
            if (required) {
                throw new Error(`Environment variable '${name}' is required but not set.`)
            }
            if (defaultValue !== undefined) {
                return defaultValue
            }
            return undefined as any
        }

        return value as unknown as T
    }
}