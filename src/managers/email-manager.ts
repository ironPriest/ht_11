import {EmailAdapter} from "../adapters/email-adapter";

export class EmailManager {

    emailAdapter: EmailAdapter;
    constructor() {
        this.emailAdapter = new EmailAdapter()
    }

    async sendRegistrationCode(email: string, subject: string, code: string) {
        await this.emailAdapter.sendEmail(email, subject, code)
    }
    async passwordRecovery(email: string, subject: string, code: string) {
        await this.emailAdapter.passwordRecovery(email, subject, code)
    }
}