import {NextFunction, Request, Response} from "express";
import {JwtUtility} from "../application/jwt-utility";
import {UsersService} from "../domain/users-service";
import {BlacktokensRepository} from "../repositories/blacktockens-repository";
import {UsersRepository} from "../repositories/users-repository";
import {EmailconfirmationRepository} from "../repositories/emailconfirmation-repository";
import {RecoveryCodesRepository} from "../repositories/recovery-codes-repository";
import {EmailAdapter} from "../adapters/email-adapter";
import {EmailManager} from "../managers/email-manager";
import {EmailService} from "../domain/email-service";
import {AuthService} from "../domain/auth-service";

//todo composition-root duplication
const blackTokensRepository = new BlacktokensRepository()
const usersRepository = new UsersRepository()
const emailConfirmationRepository = new EmailconfirmationRepository()
const recoveryCodesRepository = new RecoveryCodesRepository()
const emailAdapter = new EmailAdapter()
const emailManager = new EmailManager(
    emailAdapter
)
const emailService = new EmailService(
    emailManager
)
const authService = new AuthService(
    usersRepository,
    emailConfirmationRepository,
    recoveryCodesRepository,
    emailService
)
const usersService = new UsersService(
    usersRepository,
    authService
)
const jwtUtility = new JwtUtility(
    blackTokensRepository
)

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtUtility.getUserIdByToken(token)

    if (userId) {
        req.user = await usersService.findById(userId)
        next()
    } else {
        return res.sendStatus(401)
    }

}