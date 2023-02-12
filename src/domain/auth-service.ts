import bcrypt from 'bcrypt'
import {UsersRepository} from "../repositories/users-repository";
import {EmailConfirmationType, RecoveryCodeType, UserType} from "../types/types";
import {ObjectId} from "mongodb";
import {v4} from "uuid";
import add from "date-fns/add"
import {emailConfirmationRepository} from "../repositories/emailconfirmation-repository";
import {emailService} from "./email-service";
import {recoveryCodesRepository} from "../repositories/recovery-codes-repository";

class AuthService {

    private usersRepository: UsersRepository;
    constructor() {
        this.usersRepository = new UsersRepository()
    }

    async createUser(login: string, password: string, email: string) {
        const passwordHash = await this._generateHash(password)

        const user = new UserType(
            new ObjectId(),
            v4(),
            login,
            passwordHash,
            email,
            new Date()
        )

        const emailConformation = new EmailConfirmationType(
            new ObjectId(),
            user.id,
            v4(),
            add(new Date(), {
                hours: 1,
                minutes: 3
            }),
            false
        )
        const creationResult = await this.usersRepository.create(user)
        const confirmationResult = await emailConfirmationRepository.create(emailConformation)
        if (!confirmationResult) return null
        await emailService.register(
            user.email,
            'subject',
            emailConformation.confirmationCode)
        return creationResult
    }
    async confirm(code: string) {
        let confirmation = await emailConfirmationRepository.findByCode(code)
        if (confirmation) {
            await emailConfirmationRepository.updateStatus(confirmation.userId)
        }
    }
    async confirmationResend(email: string) {
        let user: UserType | null = await this.usersRepository.findByEmail(email)
        if (user) {
            let userId = user.id
            let newConfirmationCode = v4()
            await emailConfirmationRepository.update(userId, newConfirmationCode)
            await emailService.register(email, 'subject', newConfirmationCode)
        } else {
            return null
        }

    }
    async passwordRecovery(email: string) {
        let recoveryCode = v4()
        const recoveryCodeEntity = new RecoveryCodeType(
            new ObjectId(),
            email,
            recoveryCode
        )
        await recoveryCodesRepository.create(recoveryCodeEntity)
        await emailService.passwordRecovery(email, 'password recovery', recoveryCode)
    }
    async newPassword(userId: string, newPassword: string) {
        const newPasswordHash = await this._generateHash(newPassword)
        return await this.usersRepository.newPassword(userId, newPasswordHash)
    }
    async _generateHash(password: string) {
        return await bcrypt.hash(password, 10)
    }

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null

        const result = await bcrypt.compare(password, user.passwordHash)
        if (!result) return null

        return user
    }
}

export const authService = new AuthService()