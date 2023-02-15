import {DeviceAuthSessionType} from "../types/types";
import {ObjectId} from "mongodb";
import {v4} from "uuid";
import add from "date-fns/add";
import {DeviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";

export class DeviceAuthSessionsService {

    constructor(
        protected deviceAuthSessionsRepository: DeviceAuthSessionsRepository
    ) {
    }

    async create(ip: string, title: string, userId: ObjectId) {

        const deviceAuthSession = new DeviceAuthSessionType(
            new ObjectId(),
            new Date().toISOString(),
            v4(),
            ip,
            title,
            userId,
            add(new Date(), {seconds: 20})
        )

        await this.deviceAuthSessionsRepository.create(deviceAuthSession)
        return deviceAuthSession
    }

    async update(deviceId: string) {
        const newLastActiveDate = new Date().toISOString()
        return await this.deviceAuthSessionsRepository.update(deviceId, newLastActiveDate)
    }

    async getSessionByUserId(userId: ObjectId): Promise<DeviceAuthSessionType | null> {
        return await this.deviceAuthSessionsRepository.getSessionByUserId(userId)
    }

    async getSessions(userId: ObjectId) {
        return await this.deviceAuthSessionsRepository.getSessions(userId)
    }

    async deleteExcept(userId: ObjectId, deviceId: string) {
        await this.deviceAuthSessionsRepository.deleteExcept(userId, deviceId)
    }

    async deleteSession(deviceId: string, userId: ObjectId) {
        return this.deviceAuthSessionsRepository.deleteSession(deviceId, userId)
    }

}