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
exports.deviceAuthSessionsService = void 0;
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const device_auth_sessions_repository_1 = require("../repositories/device-auth-sessions-repository");
exports.deviceAuthSessionsService = {
    create(ip, title, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceAuthSession = {
                _id: new mongodb_1.ObjectId(),
                lastActiveDate: new Date(),
                deviceId: (0, uuid_1.v4)(),
                ip: ip,
                title: title,
                userId: userId,
                rtExpDate: (0, add_1.default)(new Date(), { seconds: 20 })
            };
            yield device_auth_sessions_repository_1.deviceAuthSessionsRepository.create(deviceAuthSession);
            return deviceAuthSession;
        });
    },
    update(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newLastActiveDate = new Date();
            return yield device_auth_sessions_repository_1.deviceAuthSessionsRepository.update(deviceId, newLastActiveDate);
        });
    },
    getSessionByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield device_auth_sessions_repository_1.deviceAuthSessionsRepository.getSessionByUserId(userId);
        });
    },
    getSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield device_auth_sessions_repository_1.deviceAuthSessionsRepository.getSessions(userId);
        });
    },
    deleteExcept(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield device_auth_sessions_repository_1.deviceAuthSessionsRepository.deleteExcept(userId, deviceId);
        });
    },
    deleteSession(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return device_auth_sessions_repository_1.deviceAuthSessionsRepository.deleteSession(deviceId, userId);
        });
    }
};
