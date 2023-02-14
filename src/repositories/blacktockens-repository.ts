import {TokenType} from "../types/types";
import {BlackTokenModelClass} from "./db";

export class BlacktokensRepository {
    async addToList(token: TokenType): Promise<boolean> {
        const newBlackTokenInstance = new BlackTokenModelClass(token)
        await newBlackTokenInstance.save()
        return true
    }

    async check(token: string): Promise<TokenType | null> {
        return BlackTokenModelClass.findOne({token}).lean()
    }

    async deleteAll() {
        await BlackTokenModelClass.deleteMany({})
    }
}