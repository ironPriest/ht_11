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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfirmationRepository = void 0;
const db_1 = require("./db");
exports.emailConfirmationRepository = {
    create(newEmailConformation) {
        return __awaiter(this, void 0, void 0, function* () {
            const newEmailConfirmationInstance = new db_1.EmailConfirmationModelClass();
            newEmailConfirmationInstance._id = newEmailConformation._id;
            newEmailConfirmationInstance.userId = newEmailConformation.userId;
            newEmailConfirmationInstance.confirmationCode = newEmailConformation.confirmationCode;
            newEmailConfirmationInstance.expirationDate = newEmailConformation.expirationDate;
            newEmailConfirmationInstance.isConfirmed = newEmailConformation.isConfirmed;
            yield newEmailConfirmationInstance.save();
            return true;
        });
    },
    update(userId, newConfirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailConfirmationInstance = yield db_1.EmailConfirmationModelClass.findOne({ userId });
            if (!emailConfirmationInstance)
                return false;
            emailConfirmationInstance.confirmationCode = newConfirmationCode;
            yield emailConfirmationInstance.save();
            return true;
        });
    },
    updateStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailConfirmationInstance = yield db_1.EmailConfirmationModelClass.findOne({ userId });
            if (!emailConfirmationInstance)
                return false;
            emailConfirmationInstance.isConfirmed = true;
            yield emailConfirmationInstance.save();
            return true;
        });
    },
    findByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.EmailConfirmationModelClass.findOne({ confirmationCode: code }).lean();
        });
    },
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.EmailConfirmationModelClass.findOne({ userId }).lean();
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.EmailConfirmationModelClass.deleteMany();
        });
    }
};
