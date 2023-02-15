import {TokenType, UserType} from "../types/types";
import jwt from 'jsonwebtoken'
import {settings} from "../types/settings";
import {ObjectId} from "mongodb";
import {BlacktokensRepository} from "../repositories/blacktockens-repository";

export class JwtUtility {

    constructor(
        protected blackTokensRepository: BlacktokensRepository
    ) {
    }

    async createJWT(user: UserType) {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '1h'})
    }

    async createRefreshToken(user: UserType, deviceId: string) {
        return jwt.sign({userId: user._id, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '1h'})
    }

    async getUserIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            console.log('verify result -->', result)
            return result.userId
        } catch (error) {
            return null
        }
    }

    async getDeviceIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            return result.deviceId
        } catch (error) {
            return null
        }
    }

    async addToBlackList(corruptedToken: string) {

        let token = new TokenType(
            new ObjectId(),
            corruptedToken
        )

        return this.blackTokensRepository.addToList(token)
    }

}