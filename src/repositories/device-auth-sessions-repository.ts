import {DeviceAuthSessionType} from "../types/types";
import {DeviceAuthSessionModelClass} from "./db";
import {ObjectId} from "mongodb";

export class DeviceAuthSessionsRepository {
    async create(deviceAuthSession: DeviceAuthSessionType): Promise<boolean> {

        const newDeviceAuthSessionInstance = new DeviceAuthSessionModelClass(deviceAuthSession)

        await newDeviceAuthSessionInstance.save()

        return  true
    }
    async update(deviceId: string, newLastActiveDate: string): Promise<boolean> {

        const deviceAuthSessionInstance = await DeviceAuthSessionModelClass.findOne({deviceId})
        if (!deviceAuthSessionInstance) return false

        deviceAuthSessionInstance.lastActiveDate = newLastActiveDate

        await deviceAuthSessionInstance.save()

        return  true
    }
    async getSessionByUserId(userId: ObjectId): Promise<DeviceAuthSessionType | null> {
        return DeviceAuthSessionModelClass.findOne({userId}).lean()
    }
    async getSessionsByDeviceId(deviceId: string): Promise<DeviceAuthSessionType | null> {
        return DeviceAuthSessionModelClass.findOne({deviceId}).lean()
    }
    async check(userId: ObjectId, deviceId: string): Promise<DeviceAuthSessionType | null> {
        return  DeviceAuthSessionModelClass.findOne({userId, deviceId}).lean()
    }
    async getSessions(userId: ObjectId) {
        return DeviceAuthSessionModelClass.
        find({userId}).
        select('-_id -userId -rtExpDate')
    }
    async deleteAll() {
        await DeviceAuthSessionModelClass.deleteMany()
    }
    async deleteExcept(userId: ObjectId, deviceId: string) {

        await DeviceAuthSessionModelClass.
        deleteMany().
        where('userId').equals(userId).
        where('deviceId').ne(deviceId)
    }
    async deleteSession(deviceId: string, userId: ObjectId): Promise<Boolean> {

        const deviceAuthSessionInstance = await DeviceAuthSessionModelClass.findOne({deviceId, userId})
        if (!deviceAuthSessionInstance) return false

        deviceAuthSessionInstance.deleteOne()

        return true
    }
}