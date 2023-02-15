import {EmailManager} from "../managers/email-manager";

export class EmailService {

    constructor(
        protected emailManager: EmailManager
    ) {
    }

    async register(email: string, subject: string, code: string) {
        await this.emailManager.sendRegistrationCode(email, subject, code)
    }
    async passwordRecovery(email: string, subject: string, code: string) {
        await this.emailManager.passwordRecovery(email, subject, code)
    }
}