import {RecoveryCodeModelClass} from "./db";
import {RecoveryCodeType} from "../types/types";

export class RecoveryCodesRepository {

    async create(newRecoveryCode: RecoveryCodeType): Promise<boolean> {

        const newRecoveryCodeInstance = new RecoveryCodeModelClass(newRecoveryCode)

        await newRecoveryCodeInstance.save()

        return true
    }

    async findByRecoveryCode(recoveryCode: string): Promise<RecoveryCodeType | null> {
        return RecoveryCodeModelClass.findOne({recoveryCode}).lean()
    }

    async deleteAll() {
        await RecoveryCodeModelClass.deleteMany()
    }

}