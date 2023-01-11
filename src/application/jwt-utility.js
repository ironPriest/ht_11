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
exports.jwtUtility = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../types/settings");
const mongodb_1 = require("mongodb");
const blacktockens_repository_1 = require("../repositories/blacktockens-repository");
exports.jwtUtility = {
    createJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId: user._id }, settings_1.settings.JWT_SECRET, { expiresIn: '1h' });
        });
    },
    createRefreshToken(user, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId: user._id, deviceId: deviceId }, settings_1.settings.JWT_SECRET, { expiresIn: '1h' });
        });
    },
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
                console.log('RESULT: ', result);
                return new mongodb_1.ObjectId(result.userId);
            }
            catch (error) {
                console.log('error: ', error);
                return null;
            }
        });
    },
    getDeviceIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
                console.log('verify result --->', result);
                return result.deviceId;
            }
            catch (error) {
                return null;
            }
        });
    },
    addToBlackList(corruptedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = {
                _id: new mongodb_1.ObjectId(),
                token: corruptedToken
            };
            return blacktockens_repository_1.blackTokensRepository.addToList(token);
        });
    }
};
