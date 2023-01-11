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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_repository_1 = require("../repositories/users-repository");
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const emailconfirmation_repository_1 = require("../repositories/emailconfirmation-repository");
const email_service_1 = require("./email-service");
const recovery_codes_repository_1 = require("../repositories/recovery-codes-repository");
exports.authService = {
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield this._generateHash(password);
            const user = {
                _id: new mongodb_1.ObjectId(),
                id: (0, uuid_1.v4)(),
                login,
                passwordHash,
                email,
                createdAt: new Date()
            };
            const emailConformation = {
                _id: new mongodb_1.ObjectId(),
                userId: user.id,
                confirmationCode: (0, uuid_1.v4)(),
                expirationDate: (0, add_1.default)(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            };
            const creationResult = yield users_repository_1.usersRepository.create(user);
            const confirmationResult = yield emailconfirmation_repository_1.emailConfirmationRepository.create(emailConformation);
            if (!confirmationResult)
                return null;
            yield email_service_1.emailService.register(user.email, 'subject', emailConformation.confirmationCode);
            return creationResult;
        });
    },
    confirm(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let confirmation = yield emailconfirmation_repository_1.emailConfirmationRepository.findByCode(code);
            if (confirmation) {
                yield emailconfirmation_repository_1.emailConfirmationRepository.updateStatus(confirmation.userId);
            }
        });
    },
    confirmationResend(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_repository_1.usersRepository.findByEmail(email);
            if (user) {
                let userId = user.id;
                let newConfirmationCode = (0, uuid_1.v4)();
                yield emailconfirmation_repository_1.emailConfirmationRepository.update(userId, newConfirmationCode);
                yield email_service_1.emailService.register(email, 'subject', newConfirmationCode);
            }
            else {
                return null;
            }
        });
    },
    passwordRecovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let recoveryCode = (0, uuid_1.v4)();
            yield recovery_codes_repository_1.recoveryCodesRepository.create({
                _id: new mongodb_1.ObjectId(),
                email,
                recoveryCode
            });
            yield email_service_1.emailService.passwordRecovery(email, 'password recovery', recoveryCode);
        });
    },
    newPassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPasswordHash = yield this._generateHash(newPassword);
            return yield users_repository_1.usersRepository.newPassword(userId, newPasswordHash);
        });
    },
    _generateHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, 10);
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user)
                return null;
            const result = yield bcrypt_1.default.compare(password, user.passwordHash);
            if (!result)
                return null;
            return user;
        });
    },
};
