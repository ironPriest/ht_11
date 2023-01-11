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
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const device_auth_sessions_service_1 = require("../domain/device-auth-sessions-service");
const jwt_utility_1 = require("../application/jwt-utility");
const device_auth_sessions_repository_1 = require("../repositories/device-auth-sessions-repository");
const blacktockens_repository_1 = require("../repositories/blacktockens-repository");
exports.securityDevicesRouter = (0, express_1.Router)({});
exports.securityDevicesRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.sendStatus(401);
    const blackToken = yield blacktockens_repository_1.blackTokensRepository.check(token);
    if (blackToken)
        return res.sendStatus(401);
    console.log('blackToken: ', blackToken);
    const userId = yield jwt_utility_1.jwtUtility.getUserIdByToken(token);
    console.log('userId: ', userId);
    if (!userId)
        return res.sendStatus(401);
    const checkSession = yield device_auth_sessions_repository_1.deviceAuthSessionsRepository.getSessionByUserId(userId);
    console.log('çheckSession: ', checkSession);
    if (!checkSession)
        return res.sendStatus(401);
    const sessions = yield device_auth_sessions_service_1.deviceAuthSessionsService.getSessions(userId);
    console.log('sessions: ', sessions);
    return res.status(200).send(sessions);
}));
exports.securityDevicesRouter.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.refreshToken)
        return res.sendStatus(401);
    const token = req.cookies.refreshToken;
    const userId = yield jwt_utility_1.jwtUtility.getUserIdByToken(token);
    if (!userId)
        return res.sendStatus(404);
    const deviceId = yield jwt_utility_1.jwtUtility.getDeviceIdByToken(token);
    if (!deviceId)
        return res.sendStatus(404);
    yield device_auth_sessions_service_1.deviceAuthSessionsService.deleteExcept(userId, deviceId);
    return res.sendStatus(204);
}));
exports.securityDevicesRouter.delete('/:deviceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield device_auth_sessions_repository_1.deviceAuthSessionsRepository.getSessionsByDeviceId(req.params.deviceId);
    if (!session)
        return res.sendStatus(404);
    if (!req.cookies.refreshToken)
        return res.sendStatus(401);
    const token = req.cookies.refreshToken;
    // const RTDeviceId = await jwtUtility.getDeviceIdByToken(token)
    // if(!RTDeviceId) {
    //     return res.sendStatus(404)
    // }
    const userId = yield jwt_utility_1.jwtUtility.getUserIdByToken(token);
    if (!userId)
        return res.sendStatus(401);
    const result = yield device_auth_sessions_repository_1.deviceAuthSessionsRepository.check(userId, req.params.deviceId);
    if (!result)
        return res.sendStatus(403);
    // if (RTDeviceId !== req.params.deviceId) {
    //     return res.sendStatus(403)
    // }
    //TODO better to check deleting result
    yield device_auth_sessions_service_1.deviceAuthSessionsService.deleteSession(req.params.deviceId, userId);
    return res.sendStatus(204);
}));
