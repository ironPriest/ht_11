import {Request, Response, Router} from "express";
import {deviceAuthSessionsService} from "../domain/device-auth-sessions-service";
import {jwtUtility} from "../application/jwt-utility";
import {deviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";
import {TokenType} from "../types/types";
import {blackTokensRepository} from "../repositories/blacktockens-repository";

export const securityDevicesRouter = Router({})

class SecurityDevicesController {

    async getDevices(req: Request, res: Response) {

        const token = req.cookies.refreshToken
        if (!token) return res.sendStatus(401)

        const blackToken: TokenType | null = await blackTokensRepository.check(token)
        if (blackToken) return res.sendStatus(401)

        const userId = await jwtUtility.getUserIdByToken(token)
        if (!userId) return res.sendStatus(401)

        const checkSession = await deviceAuthSessionsRepository.getSessionByUserId(userId)
        if (!checkSession) return res.sendStatus(401)

        const sessions = await deviceAuthSessionsService.getSessions(userId)

        return res.status(200).send(sessions)
    }

    async deleteOtherDevices(req: Request, res: Response) {

        if (!req.cookies.refreshToken) return res.sendStatus(401)

        const token = req.cookies.refreshToken

        const userId = await jwtUtility.getUserIdByToken(token)
        if (!userId) return res.sendStatus(404)

        const deviceId = await jwtUtility.getDeviceIdByToken(token)
        if (!deviceId) return res.sendStatus(404)

        await deviceAuthSessionsService.deleteExcept(userId, deviceId)

        return res.sendStatus(204)
    }

    async deleteDevice(req: Request, res: Response) {

        const session = await deviceAuthSessionsRepository.getSessionsByDeviceId(req.params.deviceId)
        if (!session) return res.sendStatus(404)

        if (!req.cookies.refreshToken) return res.sendStatus(401)

        const token = req.cookies.refreshToken

        const userId = await jwtUtility.getUserIdByToken(token)
        if (!userId) return res.sendStatus(401)

        const result = await deviceAuthSessionsRepository.check(userId, req.params.deviceId)
        if (!result) return res.sendStatus(403)

        //TODO better to check deleting result
        await deviceAuthSessionsService.deleteSession(req.params.deviceId, userId)

        return res.sendStatus(204)
    }

}

const securityDeviceController = new SecurityDevicesController()

securityDevicesRouter.get('/', securityDeviceController.getDevices )
securityDevicesRouter.delete('/', securityDeviceController.deleteOtherDevices )
securityDevicesRouter.delete('/:deviceId', securityDeviceController.deleteDevice )