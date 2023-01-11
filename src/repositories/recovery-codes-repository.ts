import {RecoveryCodeModelClass} from "./db";
import {BlogType, RecoveryCodeType} from "../types/types";

export const recoveryCodesRepository = {
    async create(newRecoveryCode: RecoveryCodeType): Promise<boolean> {
        //await RecoveryCodeModelClass.insertOne(recoveryCode)

        const newRecoveryCodeInstance = new RecoveryCodeModelClass()
        newRecoveryCodeInstance._id = newRecoveryCode._id
        newRecoveryCodeInstance.email = newRecoveryCode.email
        newRecoveryCodeInstance.recoveryCode = newRecoveryCode.recoveryCode

        await newRecoveryCodeInstance.save()

        return true
    },
    async findByRecoveryCode(recoveryCode: string): Promise<RecoveryCodeType | null> {
        return RecoveryCodeModelClass.findOne({recoveryCode}).lean()
    },
    async deleteAll() {
        await RecoveryCodeModelClass.deleteMany()
    }
}