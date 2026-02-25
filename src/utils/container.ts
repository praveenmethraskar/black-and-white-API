import path from "path"
import { scopePerRequest, loadControllers } from "awilix-express"
import { MongoManager } from "../utils/mongo"

import { createContainer, asClass } from 'awilix'

import { interceptor } from "./response"

import { AppCryptoService } from "../services/crypto"
import { Application } from "express"
import { AppEnvService } from "../services/env"
import { AppConfig } from "./config"
import { Logger, AppLogger } from "./logger"
import { AppAuthMiddleware } from "./middleware"
import { AppUserRepository } from "../repository/user"
import { UserService } from "../services/user"
import { UserController } from "../controllers/user"

// Enquiry
import { AppEnquiryRepository } from "../repository/enquiry"
import { EnquiryService } from "../services/enquiry"
import { EnquiryController } from "../controllers/enquiry"

import { AppJobApplicationRepository } from "../repository/jobApplication"
import { JobApplicationService } from "../services/jobApplication"
import { JobApplicationController } from "../controllers/jobApplication"

export const loadContainer = (app: Application) => {
    const Container = createContainer({
        injectionMode: 'CLASSIC'
    })

    Container.register({
        envService: asClass(AppEnvService).singleton(),
        logger: asClass(AppLogger).singleton().inject(() => ({
            sensitiveFields: [
                "password",
                "phone",
                "email",
                "receiverMobile",
                "name",
                "username",
                "token",
                "paymentInfo",
                "bluetoothMacId"
            ]
        })),

        appConfig: asClass(AppConfig).singleton(),
        mongoManager: asClass(MongoManager).singleton(),

        authMiddleware: asClass(AppAuthMiddleware).singleton(),

        // User
        userRepository: asClass(AppUserRepository).scoped(),
        cryptoService: asClass(AppCryptoService).scoped(),
        userService: asClass(UserService).scoped(),
        userController: asClass(UserController).scoped(),

        // Enquiry
        enquiryRepository: asClass(AppEnquiryRepository).scoped(),
        enquiryService: asClass(EnquiryService).scoped(),
        enquiryController: asClass(EnquiryController).scoped(),

        jobApplicationRepository: asClass(AppJobApplicationRepository).scoped(),
        jobApplicationService: asClass(JobApplicationService).scoped(),
        jobApplicationController: asClass(JobApplicationController).scoped(),
    })

    const logger = Container.resolve<Logger>("logger")

    app.use(logger.contextMiddleware.bind(logger))
    app.use(logger.logRequestAndResponse.bind(logger))
    app.use(scopePerRequest(Container))

    app.use(loadControllers('../routes/**/*.*s', { cwd: __dirname }))

    Container.resolve<MongoManager>('mongoManager')

    app.use(interceptor)

    const appConfig = Container.resolve<AppConfig>("appConfig")
    if (appConfig.isTesting) {
        app.listen(0, () => { })
    } else {
        const port = process.env.PORT || 5000
        app.listen(port, () => {
            logger.info(`Server now listening at localhost:${port}`)
            Container.resolve<MongoManager>('mongoManager')
        })
    }
}