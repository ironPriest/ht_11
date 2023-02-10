import {emailAdapter} from "../adapters/email-adapter";

class EmailManager {
    async sendRegistrationCode(email: string, subject: string, code: string) {
        await emailAdapter.sendEmail(email, subject, code)
    }
    async passwordRecovery(email: string, subject: string, code: string) {
        await emailAdapter.passwordRecovery(email, subject, code)
    }
}

export const emailManager = new EmailManager()