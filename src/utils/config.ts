import { EnvService } from "../services/env"


/**
 * Interface representing the configuration settings for the application.
 * 
 * This interface defines the structure of the configuration object that holds
 * various settings such as database connection URI, port number, logging settings, 
 * environment type, and supported locales. These settings are essential for the application's 
 * runtime and are retrieved from the `EnvService`.
 */
export interface Config {
    /**
     * The URI used to connect to the database.
     * This is retrieved from the environment service.
     * 
     * @type {string}
     * @returns {string} - The database connection URI.
     */
    connectionUri: string

    /**
     * The name of the database environment (e.g., "production", "staging").
     * This corresponds to the `nodeEnv` from the environment service.
     * 
     * @type {string}
     * @returns {string} - The database environment name.
     */
    db: string

    /**
     * The port on which the application is running.
     * This is retrieved from the environment service.
     * 
     * @type {number}
     * @returns {number} - The application port number.
     */
    port: number

    /**
     * A boolean value indicating whether the application is running in a testing environment.
     * This is determined based on the `nodeEnv` from the environment service.
     * 
     * @type {boolean}
     * @returns {boolean} - `true` if the environment is "testing", `false` otherwise.
     */
    isTesting: boolean

    /**
     * A boolean value indicating whether the application is running in a production environment.
     * This is determined based on the `nodeEnv` from the environment service.
     * 
     * @type {boolean}
     * @returns {boolean} - `true` if the environment is "production", `false` otherwise.
     */
    isProd: boolean

    /**
     * A boolean value indicating whether the application is running in a staging environment.
     * This is determined based on the `nodeEnv` from the environment service.
     * 
     * @type {boolean}
     * @returns {boolean} - `true` if the environment is "staging", `false` otherwise.
     */
    isStaging: boolean

    /**
     * A list of supported locales for the application.
     * These locales represent the languages/regions the application supports, e.g., "en-IN" for India, "en-US" for the United States.
     * 
     * @type {Array<string>}
     * @returns {Array<string>} - An array of supported locales, e.g., ["en-IN", "en-AU", "en-US"].
     */
    supportedLocales: Array<string>
}

export class AppConfig implements Config {
    constructor(private envService: EnvService) { }

    public get connectionUri(): string {
        return this.envService.databaseUrl
    }

    public get db(): string {
        return this.envService.nodeEnv
    }

    public get port(): number {
        return this.envService.port
    }

    public get isTesting(): boolean {
        return this.envService.nodeEnv === "testing"
    }

    public get isProd(): boolean {
        return this.envService.nodeEnv === "production"
    }

    public get isStaging(): boolean {
        return this.envService.nodeEnv === "staging"
    }

    public get supportedLocales(): Array<string> { return ["en-IN", "en-AU", "en-US"] }
}