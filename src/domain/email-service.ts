import {emailManager} from "../managers/email-manager";

export const emailService = {
    async register(email: string, subject: string, code: string) {
        await emailManager.sendRegistrationCode(email, subject, code)
    },
    async passwordRecovery(email: string, subject: string, code: string) {
        await emailManager.passwordRecovery(email, subject, code)
    }
}