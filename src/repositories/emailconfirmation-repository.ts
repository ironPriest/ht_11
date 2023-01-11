import {BlogType, EmailConfirmationType} from "../types/types";
import {EmailConfirmationModelClass} from "./db";

export const emailConfirmationRepository = {
    async create(newEmailConformation: EmailConfirmationType): Promise<boolean> {

        const newEmailConfirmationInstance = new EmailConfirmationModelClass()
        newEmailConfirmationInstance._id = newEmailConformation._id
        newEmailConfirmationInstance.userId = newEmailConformation.userId
        newEmailConfirmationInstance.confirmationCode = newEmailConformation.confirmationCode
        newEmailConfirmationInstance.expirationDate = newEmailConformation.expirationDate
        newEmailConfirmationInstance.isConfirmed = newEmailConformation.isConfirmed

        await newEmailConfirmationInstance.save()

        return true
    },
    async update(userId: string, newConfirmationCode: string): Promise<boolean> {

        const emailConfirmationInstance = await EmailConfirmationModelClass.findOne({userId})
        if (!emailConfirmationInstance) return false

        emailConfirmationInstance.confirmationCode = newConfirmationCode

        await emailConfirmationInstance.save()

        return true
    },
    async updateStatus(userId: string): Promise<boolean> {

        const emailConfirmationInstance = await EmailConfirmationModelClass.findOne({userId})
        if (!emailConfirmationInstance) return false

        emailConfirmationInstance.isConfirmed = true

        await emailConfirmationInstance.save()

        return true
    },
    async findByCode(code: string): Promise<EmailConfirmationType | null> {
        return EmailConfirmationModelClass.findOne({confirmationCode: code}).lean()
    },
    async findByUserId(userId: string): Promise<EmailConfirmationType | null> {
        return EmailConfirmationModelClass.findOne({userId}).lean()
    },
    async deleteAll() {
        await EmailConfirmationModelClass.deleteMany()
    }
}