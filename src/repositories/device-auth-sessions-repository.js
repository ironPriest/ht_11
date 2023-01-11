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
exports.deviceAuthSessionsRepository = void 0;
const db_1 = require("./db");
exports.deviceAuthSessionsRepository = {
    create(deviceAuthSession) {
        return __awaiter(this, void 0, void 0, function* () {
            const newDeviceAuthSessionInstance = new db_1.DeviceAuthSessionModelClass();
            newDeviceAuthSessionInstance._id = deviceAuthSession._id;
            newDeviceAuthSessionInstance.lastActiveDate = deviceAuthSession.lastActiveDate;
            newDeviceAuthSessionInstance.deviceId = deviceAuthSession.deviceId;
            newDeviceAuthSessionInstance.ip = deviceAuthSession.ip;
            newDeviceAuthSessionInstance.title = deviceAuthSession.title;
            newDeviceAuthSessionInstance.userId = deviceAuthSession.userId;
            newDeviceAuthSessionInstance.rtExpDate = deviceAuthSession.rtExpDate;
            yield newDeviceAuthSessionInstance.save();
            return true;
        });
    },
    update(deviceId, newLastActiveDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceAuthSessionInstance = yield db_1.DeviceAuthSessionModelClass.findOne({ deviceId });
            if (!deviceAuthSessionInstance)
                return false;
            deviceAuthSessionInstance.lastActiveDate = newLastActiveDate;
            yield deviceAuthSessionInstance.save();
            return true;
        });
    },
    getSessionByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.DeviceAuthSessionModelClass.findOne({ userId }).lean();
        });
    },
    getSessionsByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.DeviceAuthSessionModelClass.findOne({ deviceId }).lean();
        });
    },
    check(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.DeviceAuthSessionModelClass.findOne({ userId, deviceId }).lean();
        });
    },
    getSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.DeviceAuthSessionModelClass.
                find({ userId }).
                select('-_id -userId -rtExpDate');
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.DeviceAuthSessionModelClass.deleteMany();
        });
    },
    deleteExcept(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            //await DeviceAuthSessionModelClass.deleteMany({userId, deviceId: {$ne: deviceId}})
            yield db_1.DeviceAuthSessionModelClass.
                deleteMany().
                where('userId').equals(userId).
                where('deviceId').ne(deviceId);
        });
    },
    deleteSession(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // let result = await DeviceAuthSessionModelClass.deleteOne({deviceId, userId})
            // return result.deletedCount === 1
            const deviceAuthSessionInstance = yield db_1.DeviceAuthSessionModelClass.findOne({ deviceId, userId });
            if (!deviceAuthSessionInstance)
                return false;
            deviceAuthSessionInstance.deleteOne();
            return true;
        });
    }
};
