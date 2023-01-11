import {DeviceAuthSessionType} from "../types/types";
import {ObjectId} from "mongodb";
import {v4} from "uuid";
import add from "date-fns/add";
import {deviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";

export const deviceAuthSessionsService = {
    async create(ip: string, title: string, userId: ObjectId) {
        const deviceAuthSession: DeviceAuthSessionType = {
            _id: new ObjectId(),
            lastActiveDate: new Date(),
            deviceId: v4(),
            ip: ip,
            title: title,
            userId: userId,
            rtExpDate: add(new Date(), {seconds: 20})
        }
        await deviceAuthSessionsRepository.create(deviceAuthSession)
        return deviceAuthSession
    },
    async update(deviceId: string) {
        const newLastActiveDate = new Date()
        return await deviceAuthSessionsRepository.update(deviceId, newLastActiveDate)
    },
    async getSessionByUserId(userId: ObjectId): Promise<DeviceAuthSessionType | null> {
        return await deviceAuthSessionsRepository.getSessionByUserId(userId)
    },
    async getSessions(userId: ObjectId) {
        return await deviceAuthSessionsRepository.getSessions(userId)
    },
    async deleteExcept(userId: ObjectId, deviceId: string) {
        await deviceAuthSessionsRepository.deleteExcept(userId, deviceId)
    },
    async deleteSession(deviceId: string, userId: ObjectId) {
        return deviceAuthSessionsRepository.deleteSession(deviceId, userId)
    }
}