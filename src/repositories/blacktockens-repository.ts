import {TokenType} from "../types/types";
import {BlackTokenModelClass} from "./db";


export const blackTokensRepository = {
    async addToList(token: TokenType): Promise<boolean> {
        // let res = await BlackTokenModelClass.insertOne(token)
        // return res.acknowledged

        const newBlackTokenInstance = new BlackTokenModelClass()
        newBlackTokenInstance._id = token._id
        newBlackTokenInstance.token = token.token

        await newBlackTokenInstance.save()

        return true
    },
    async check(token: string): Promise<TokenType | null> {
        // let res = await BlackTokenModelClass.findOne({token})
        // if (res) {
        //     return res
        // } else {
        //     return null
        // }

        return BlackTokenModelClass.findOne({token}).lean()
    },
    async deleteAll() {
        await BlackTokenModelClass.deleteMany({})
    }
}