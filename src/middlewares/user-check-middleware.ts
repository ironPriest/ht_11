import {NextFunction, Request, Response} from "express";
import {JwtUtility} from "../application/jwt-utility";
import {UsersService} from "../domain/users-service";
import {BlacktokensRepository} from "../repositories/blacktockens-repository";
import {AuthService} from "../domain/auth-service";
import {UsersRepository} from "../repositories/users-repository";
import {EmailconfirmationRepository} from "../repositories/emailconfirmation-repository";
import {RecoveryCodesRepository} from "../repositories/recovery-codes-repository";
import {EmailAdapter} from "../adapters/email-adapter";
import {EmailManager} from "../managers/email-manager";
import {EmailService} from "../domain/email-service";

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

export const userCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers.authorization
        const token = auth!.split(' ')[1]
        const userId = await jwtUtility.getUserIdByToken(token)
        req.user = await usersService.findById(userId)
        return next()
    }
    catch (e) {
        req.user = null
        return next()
    }
}