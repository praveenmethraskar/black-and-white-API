import mongoose from "mongoose"
import { Config } from "./config"
import { Logger } from "./logger"

/**
 * MongoDB connection manager that handles connection lifecycle events.
 */
export class MongoManager {
    constructor(
        private readonly appConfig: Config,
        private readonly logger: Logger
    ) {
        // Start the MongoDB connection process when the class is initialized
        this.run()

        // Gracefully handle SIGINT (Ctrl+C) by closing the connection
        process.on('SIGINT', () => {
            this.close()
        })
    }

    /**
     * Starts the MongoDB connection and listens for connection events.
     */
    run(): void {
        if (mongoose.connection.readyState === 0) {
            const logger = this.logger

            // No dbName option — Mongoose will use the database name
            // directly from the URI: mongodb://localhost:27017/blackandwhiteDB
            mongoose.connect(this.appConfig.connectionUri)

            mongoose.connection.on("connected", () => {
                logger.info(`Mongoose db connected to: ${this.appConfig.connectionUri}`)
            })

            mongoose.connection.on("error", (err) => {
                logger.error(`Error: Mongoose default connection has occurred ${err} error`)
            })

            mongoose.connection.on("disconnected", () => {
                logger.info("Mongoose default connection is disconnected")
            })
        }
    }

    /**
     * Closes the MongoDB connection with a delay of 5 seconds.
     */
    close(): void {
        const logger = this.logger

        setTimeout(() => {
            if (mongoose.connection.readyState === 1) {
                logger.info("Closing Mongoose connection...")
                mongoose.connection.close()
            } else {
                logger.warn("Mongoose connection already closed")
            }
        }, 5000)
    }
}