import {UserType} from "../types/types";
import jwt from 'jsonwebtoken'
import {settings} from "../types/settings";
import {ObjectId} from "mongodb";
import {blackTokensRepository} from "../repositories/blacktockens-repository";

export const jwtUtility = {
    async createJWT(user: UserType) {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '1h'})
    },
    async createRefreshToken(user: UserType, deviceId: string) {
        return jwt.sign({userId: user._id, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '1h'})
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            console.log('RESULT: ', result)
            return new ObjectId(result.userId)
        } catch (error) {
            console.log('error: ', error)
            return null
        }
    },
    async getDeviceIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            console.log('verify result --->', result)
            return result.deviceId
        } catch (error) {
            return null
        }
    },
    async addToBlackList(corruptedToken: string) {
        let token = {
            _id: new ObjectId(),
            token: corruptedToken
        }
        return blackTokensRepository.addToList(token)
    }
}