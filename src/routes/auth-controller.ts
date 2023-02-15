import {UsersService} from "../domain/users-service";
import {BlacktokensRepository} from "../repositories/blacktockens-repository";
import {JwtUtility} from "../application/jwt-utility";
import {DeviceAuthSessionsService} from "../domain/device-auth-sessions-service";
import {RecoveryCodesRepository} from "../repositories/recovery-codes-repository";
import {AuthService} from "../domain/auth-service";
import {Request, Response} from "express";
import {DeviceAuthSessionType, TokenType} from "../types/types";

export class AuthController {

    constructor(
        protected usersService: UsersService,
        protected blackTokensRepository: BlacktokensRepository,
        protected jwtUtility: JwtUtility,
        protected deviceAuthSessionsService: DeviceAuthSessionsService,
        protected recoveryCodesRepository: RecoveryCodesRepository,
        protected authService: AuthService
    ) {
    }

    async login(req: Request, res: Response) {

        const user = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) return res.sendStatus(401)
        const userId = user._id

        const ip = req.ip
        const title = req.headers["user-agent"]!

        const deviceAuthSession: DeviceAuthSessionType = await this.deviceAuthSessionsService.create(ip, title, userId)
        const deviceId = deviceAuthSession.deviceId

        const token = await this.jwtUtility.createJWT(user)
        const refreshToken = await this.jwtUtility.createRefreshToken(user, deviceId)

        return res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        })
            .send({
                'accessToken': token
            })
    }

    async refreshToken(req: Request, res: Response) {

        if (!req.cookies.refreshToken) return res.sendStatus(401)

        const reqRefreshToken = req.cookies.refreshToken
        // token check
        const blackToken: TokenType | null = await this.blackTokensRepository.check(reqRefreshToken)
        if (blackToken) return res.sendStatus(401)

        const userId = await this.jwtUtility.getUserIdByToken(req.cookies.refreshToken)
        if (!userId) return res.sendStatus(401)

        const user = await this.usersService.findById(userId)
        if (!user) return res.sendStatus(401)

        await this.jwtUtility.addToBlackList(reqRefreshToken)

        const token = await this.jwtUtility.createJWT(user)

        const deviceAuthSession: DeviceAuthSessionType | null = await this.deviceAuthSessionsService.getSessionByUserId(user._id)
        if (!deviceAuthSession) return res.sendStatus(404)

        const refreshToken = await this.jwtUtility.createRefreshToken(user, deviceAuthSession.deviceId)

        const updateRes = await this.deviceAuthSessionsService.update(deviceAuthSession.deviceId)
        if (!updateRes) return res.sendStatus(400)

        return res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        }).send({
            'accessToken': token
        })
    }

    async registration(req: Request, res: Response) {
        await this.authService.createUser(
            req.body.login,
            req.body.password,
            req.body.email)
        return res.sendStatus(204)
    }

    async registrationConfirmation(req: Request, res: Response) {
        await this.authService.confirm(req.body.code)
        return res.sendStatus(204)
    }

    async registrationEmailResending(req: Request, res: Response) {
        await this.authService.confirmationResend(req.body.email)
        return res.sendStatus(204)
    }

    async passwordRecovery(req: Request, res: Response) {
        await this.authService.passwordRecovery(req.body.email)
        return res.sendStatus(204)
    }

    async newPassword(req: Request, res: Response) {

        let recoveryCodeEntity = await this.recoveryCodesRepository.findByRecoveryCode(req.body.recoveryCode)
        if (!recoveryCodeEntity) return res.sendStatus(404)

        let user = await this.usersService.findByEmail(recoveryCodeEntity.email)
        if (!user) return res.sendStatus(404)

        await this.authService.newPassword(user.id, req.body.newPassword)
        return res.sendStatus(204)
    }

    async logout(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        const blackToken: TokenType | null = await this.blackTokensRepository.check(refreshToken)
        if (blackToken) return res.sendStatus(401)

        const userId = await this.jwtUtility.getUserIdByToken(refreshToken)
        if (!userId) return res.sendStatus(401)

        const deviceId = await this.jwtUtility.getDeviceIdByToken(refreshToken)

        const session = await this.deviceAuthSessionsService.getSessionByUserId(userId)
        if (!session) return res.sendStatus(401)

        const deleteResult = await this.deviceAuthSessionsService.deleteSession(deviceId, userId)
        if (!deleteResult) return res.sendStatus(400)

        const addingResult = await this.jwtUtility.addToBlackList(refreshToken)
        if (!addingResult) return res.sendStatus(400)

        return res.status(204).cookie('refreshToken', '', {
            httpOnly: true,
            secure: true
        }).send({})
    }

    async me(req: Request, res: Response) {
        if (!req.headers.authorization) {
            return res.sendStatus(401)
        }
        const authType = req.headers.authorization.split(' ')[0]
        if (authType !== 'Bearer') return res.sendStatus(401)
        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.jwtUtility.getUserIdByToken(token)
        if (!userId) return res.sendStatus(401)
        const user = await this.usersService.findById(userId)
        if (!user) return res.sendStatus(401)
        return res.status(200).send({
            email: user.email,
            login: user.login,
            userId: user.id
        })
    }

}