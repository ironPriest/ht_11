import {Router} from "express";
import {UsersService} from "../domain/users-service";
import {EmailconfirmationRepository} from "../repositories/emailconfirmation-repository";
import {inputValidationMiddleware, rateLimiter} from "../middlewares/input-validation-middleware";
import {body} from "express-validator";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {RecoveryCodesRepository} from "../repositories/recovery-codes-repository";
import {authController} from "../composition-root";
import {UsersRepository} from "../repositories/users-repository";
import {AuthService} from "../domain/auth-service";
import {EmailService} from "../domain/email-service";
import {EmailAdapter} from "../adapters/email-adapter";
import {EmailManager} from "../managers/email-manager";

export const authRouter = Router({})

//todo usersService instance creation for middlewares authRouter
const usersRepository = new UsersRepository()
const recoveryCodesRepository = new RecoveryCodesRepository()
const emailConfirmationRepository = new EmailconfirmationRepository()
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

const loginValidation = body('login')
    .trim()
    .exists({checkFalsy: true})
    .isString()
    .isLength({min: 3})
    .isLength({max: 10})

const passwordValidation = body('password')
    .trim()
    .exists({checkFalsy: true})
    .isString()
    .isLength({min: 6})
    .isLength({max: 20})

const emailValidation = body('email')
    .trim()
    .exists({checkFalsy: true})
    .isString()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')

const newPasswordValidation = body('newPassword')
    .isLength({min: 6})
    .isLength({max: 20})

const doubleLoginValidation = body('loginOrEmail').custom(async (loginOrEmail,) => {
    const user = await usersService.findByLoginOrEmail(loginOrEmail)
    if (user) {
        throw new Error('login already exists')
    }
    return true
})

const doubleEmailValidation = body('email').custom(async (email,) => {
    const user = await usersService.findByEmail(email)
    if (user) {
        throw new Error('email already exists')
    }
    return true
})

const doubleConfirmValidation = body('code').custom(async (code,) => {
    const emailConfirmation = await emailConfirmationRepository.findByCode(code)
    if (emailConfirmation) {
        if (emailConfirmation.isConfirmed) {
            throw new Error('already confirmed')
        } else return true
    } else throw new Error('no such user')

})

const doubleResendingValidation = body('email').custom(async (email,) => {
    const user = await usersService.findByEmail(email)
    if (user) {
        const emailConfirmation = await emailConfirmationRepository.findByUserId(user.id)
        if (emailConfirmation!.isConfirmed) {
            throw new Error('already confirmed')
        } else return true
    } else {
        throw new Error('no such email')
    }
})

const recoveryCodeValidation = body('recoveryCode').custom(async (recoveryCode, ) => {
    const recoveryCodeEntity = await recoveryCodesRepository.findByRecoveryCode(recoveryCode)
    if(!recoveryCodeEntity) throw new Error('bad recovery code')
    return true
})

authRouter.post(
    '/login',
    rateLimiter,
    authController.login.bind(authController)
)

authRouter.post(
    '/refresh-token',
    authController.refreshToken.bind(authController)
)

authRouter.post(
    '/registration',
    loginValidation,
    passwordValidation,
    emailValidation,
    doubleLoginValidation,
    doubleEmailValidation,
    inputValidationMiddleware,
    rateLimiter,
    authController.registration.bind(authController)
)

authRouter.post('/registration-confirmation',
    doubleConfirmValidation,
    rateLimiter,
    inputValidationMiddleware,
    authController.registrationConfirmation.bind(authController)
)

authRouter.post('/registration-email-resending',
    doubleResendingValidation,
    inputValidationMiddleware,
    rateLimiter,
    authController.registrationEmailResending.bind(authController)
)

authRouter.post(
    '/password-recovery',
    emailValidation,
    inputValidationMiddleware,
    rateLimiter,
    authController.passwordRecovery.bind(authController)
)

authRouter.post(
    '/new-password',
    newPasswordValidation,
    recoveryCodeValidation,
    rateLimiter,
    inputValidationMiddleware,
    authController.newPassword.bind(authController)
)

authRouter.post(
    '/logout',
    authController.logout.bind(authController)
)

authRouter.get(
    '/me',
    bearerAuthMiddleware,
    authController.me.bind(authController)
)