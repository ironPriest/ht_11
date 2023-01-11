import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendRegistrationCode(email: string, subject: string, code: string) {
        await emailAdapter.sendEmail(email, subject, code)
    },
    async passwordRecovery(email: string, subject: string, code: string) {
        await emailAdapter.passwordRecovery(email, subject, code)
    },
}