import {Request, Response, Router} from "express";
import {DeviceAuthSessionsService} from "../domain/device-auth-sessions-service";
import {JwtUtility} from "../application/jwt-utility";
import {DeviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";
import {TokenType} from "../types/types";
import {BlacktokensRepository} from "../repositories/blacktockens-repository";

export const securityDevicesRouter = Router({})

class SecurityDevicesController {

    private jwtUtility: JwtUtility;
    private blackTokensRepository: BlacktokensRepository;
    private deviceAuthSessionsRepository: DeviceAuthSessionsRepository;
    private deviceAuthSessionsService: DeviceAuthSessionsService;
    constructor() {
        this.jwtUtility = new JwtUtility()
        this.blackTokensRepository = new BlacktokensRepository()
        this.deviceAuthSessionsRepository = new DeviceAuthSessionsRepository()
        this.deviceAuthSessionsService = new DeviceAuthSessionsService()
    }

    async getDevices(req: Request, res: Response) {

        const token = req.cookies.refreshToken
        if (!token) return res.sendStatus(401)

        const blackToken: TokenType | null = await this.blackTokensRepository.check(token)
        if (blackToken) return res.sendStatus(401)

        const userId = await this.jwtUtility.getUserIdByToken(token)
        if (!userId) return res.sendStatus(401)

        const checkSession = await this.deviceAuthSessionsRepository.getSessionByUserId(userId)
        if (!checkSession) return res.sendStatus(401)

        const sessions = await this.deviceAuthSessionsService.getSessions(userId)

        return res.status(200).send(sessions)
    }

    async deleteOtherDevices(req: Request, res: Response) {

        if (!req.cookies.refreshToken) return res.sendStatus(401)

        const token = req.cookies.refreshToken

        const userId = await this.jwtUtility.getUserIdByToken(token)
        if (!userId) return res.sendStatus(404)

        const deviceId = await this.jwtUtility.getDeviceIdByToken(token)
        if (!deviceId) return res.sendStatus(404)

        await this.deviceAuthSessionsService.deleteExcept(userId, deviceId)

        return res.sendStatus(204)
    }

    async deleteDevice(req: Request, res: Response) {

        const session = await this.deviceAuthSessionsRepository.getSessionsByDeviceId(req.params.deviceId)
        if (!session) return res.sendStatus(404)

        if (!req.cookies.refreshToken) return res.sendStatus(401)

        const token = req.cookies.refreshToken

        const userId = await this.jwtUtility.getUserIdByToken(token)
        if (!userId) return res.sendStatus(401)

        const result = await this.deviceAuthSessionsRepository.check(userId, req.params.deviceId)
        if (!result) return res.sendStatus(403)

        //TODO better to check deleting result
        await this.deviceAuthSessionsService.deleteSession(req.params.deviceId, userId)

        return res.sendStatus(204)
    }

}

const securityDeviceController = new SecurityDevicesController()

securityDevicesRouter.get('/', securityDeviceController.getDevices.bind(securityDeviceController) )
securityDevicesRouter.delete('/', securityDeviceController.deleteOtherDevices.bind(securityDeviceController) )
securityDevicesRouter.delete('/:deviceId', securityDeviceController.deleteDevice.bind(securityDeviceController) )