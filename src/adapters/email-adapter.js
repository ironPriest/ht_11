"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailAdapter = {
    sendEmail(email, subject, code) {
        return __awaiter(this, void 0, void 0, function* () {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'nodeDevTest9@gmail.com',
                    pass: 'kkokbdmtutfllysy',
                },
            });
            //create customizable html
            let html = '<h1>Thank for your registration</h1>\n' +
                '<p>To finish registration please follow the link below:\n' +
                '<a href=\'https://somesite.com/confirm-email?code=' + code + '\'>complete registration</a>\n' +
                '</p>';
            // send mail with defined transport object
            let info = yield transporter.sendMail({
                from: 'boss <nodeDevTest9@gmail.com>',
                to: email,
                subject: subject,
                html: html // html body
            });
            return info;
        });
    },
    passwordRecovery(email, subject, code) {
        return __awaiter(this, void 0, void 0, function* () {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'nodeDevTest9@gmail.com',
                    pass: 'kkokbdmtutfllysy',
                },
            });
            //create customizable html
            let html = '<h1>Password recovery</h1>' +
                '<p>To finish password recovery please follow the link below:' +
                '<a href=\'https://somesite.com/password-recovery?recoveryCode=' + code + '\'>recovery password</a>\n' +
                '</p>';
            // send mail with defined transport object
            let info = yield transporter.sendMail({
                from: 'boss <nodeDevTest9@gmail.com>',
                to: email,
                subject: subject,
                html: html // html body
            });
            return info;
        });
    }
};
