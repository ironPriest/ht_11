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
exports.authRouter = void 0;
const express_1 = require("express");
const auth_service_1 = require("../domain/auth-service");
const jwt_utility_1 = require("../application/jwt-utility");
const users_service_1 = require("../domain/users-service");
const emailconfirmation_repository_1 = require("../repositories/emailconfirmation-repository");
const blacktockens_repository_1 = require("../repositories/blacktockens-repository");
const device_auth_sessions_service_1 = require("../domain/device-auth-sessions-service");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const express_validator_1 = require("express-validator");
const bearer_auth_middleware_1 = require("../middlewares/bearer-auth-middleware");
const recovery_codes_repository_1 = require("../repositories/recovery-codes-repository");
exports.authRouter = (0, express_1.Router)({});
const loginValidation = (0, express_validator_1.body)('login')
    .trim()
    .exists({ checkFalsy: true })
    .isString()
    .isLength({ min: 3 })
    .isLength({ max: 10 });
const passwordValidation = (0, express_validator_1.body)('password')
    .trim()
    .exists({ checkFalsy: true })
    .isString()
    .isLength({ min: 6 })
    .isLength({ max: 20 });
const emailValidation = (0, express_validator_1.body)('email')
    .trim()
    .exists({ checkFalsy: true })
    .isString()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
const newPasswordValidation = (0, express_validator_1.body)('newPassword')
    .isLength({ min: 6 })
    .isLength({ max: 20 });
const doubleLoginValidation = (0, express_validator_1.body)('loginOrEmail').custom((loginOrEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.findByLoginOrEmail(loginOrEmail);
    if (user) {
        throw new Error('login already exists');
    }
    return true;
}));
const doubleEmailValidation = (0, express_validator_1.body)('email').custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.findByEmail(email);
    if (user) {
        throw new Error('email already exists');
    }
    return true;
}));
const doubleConfirmValidation = (0, express_validator_1.body)('code').custom((code) => __awaiter(void 0, void 0, void 0, function* () {
    const emailConfirmation = yield emailconfirmation_repository_1.emailConfirmationRepository.findByCode(code);
    if (emailConfirmation) {
        if (emailConfirmation.isConfirmed) {
            throw new Error('already confirmed');
        }
        else
            return true;
    }
    else
        throw new Error('no such user');
}));
const doubleResendingValidation = (0, express_validator_1.body)('email').custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.findByEmail(email);
    if (user) {
        const emailConfirmation = yield emailconfirmation_repository_1.emailConfirmationRepository.findByUserId(user.id);
        if (emailConfirmation.isConfirmed) {
            throw new Error('already confirmed');
        }
        else
            return true;
    }
    else {
        throw new Error('no such email');
    }
}));
const recoveryCodeValidation = (0, express_validator_1.body)('recoveryCode').custom((recoveryCode) => __awaiter(void 0, void 0, void 0, function* () {
    const recoveryCodeEntity = yield recovery_codes_repository_1.recoveryCodesRepository.findByRecoveryCode(recoveryCode);
    if (!recoveryCodeEntity)
        throw new Error('bad recovery code');
    return true;
}));
exports.authRouter.post('/login', input_validation_middleware_1.rateLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.authService.checkCredentials(req.body.loginOrEmail, req.body.password);
    console.log('user', user);
    if (!user)
        return res.sendStatus(401);
    const userId = user._id;
    const ip = req.ip;
    const title = req.headers["user-agent"];
    const deviceAuthSession = yield device_auth_sessions_service_1.deviceAuthSessionsService.create(ip, title, userId);
    const deviceId = deviceAuthSession.deviceId;
    const token = yield jwt_utility_1.jwtUtility.createJWT(user);
    const refreshToken = yield jwt_utility_1.jwtUtility.createRefreshToken(user, deviceId);
    return res.status(200).cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true
    })
        .send({
        'accessToken': token
    });
}));
exports.authRouter.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.refreshToken) {
        return res.sendStatus(401);
    }
    const reqRefreshToken = req.cookies.refreshToken;
    // token check
    const blackToken = yield blacktockens_repository_1.blackTokensRepository.check(reqRefreshToken);
    if (blackToken) {
        return res.sendStatus(401);
    }
    const userId = yield jwt_utility_1.jwtUtility.getUserIdByToken(req.cookies.refreshToken);
    if (!userId) {
        return res.sendStatus(401);
    }
    const user = yield users_service_1.usersService.findById(userId);
    if (!user) {
        console.log('cant find user');
        return res.sendStatus(401);
    }
    yield jwt_utility_1.jwtUtility.addToBlackList(reqRefreshToken);
    const token = yield jwt_utility_1.jwtUtility.createJWT(user);
    const deviceAuthSession = yield device_auth_sessions_service_1.deviceAuthSessionsService.getSessionByUserId(user._id);
    if (!deviceAuthSession) {
        return res.sendStatus(404);
    }
    const refreshToken = yield jwt_utility_1.jwtUtility.createRefreshToken(user, deviceAuthSession.deviceId);
    const updateRes = yield device_auth_sessions_service_1.deviceAuthSessionsService.update(deviceAuthSession.deviceId);
    if (!updateRes) {
        return res.sendStatus(400);
    }
    return res.status(200).cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true
    }).send({
        'accessToken': token
    });
}));
exports.authRouter.post('/registration', loginValidation, passwordValidation, emailValidation, doubleLoginValidation, doubleEmailValidation, input_validation_middleware_1.inputValidationMiddleware, input_validation_middleware_1.rateLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.authService.createUser(req.body.login, req.body.password, req.body.email);
    return res.sendStatus(204);
}));
exports.authRouter.post('/registration-confirmation', doubleConfirmValidation, input_validation_middleware_1.rateLimiter, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.authService.confirm(req.body.code);
    return res.sendStatus(204);
}));
exports.authRouter.post('/registration-email-resending', doubleResendingValidation, input_validation_middleware_1.inputValidationMiddleware, input_validation_middleware_1.rateLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.authService.confirmationResend(req.body.email);
    return res.sendStatus(204);
}));
exports.authRouter.post('/password-recovery', emailValidation, input_validation_middleware_1.inputValidationMiddleware, input_validation_middleware_1.rateLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.authService.passwordRecovery(req.body.email);
    return res.sendStatus(204);
}));
exports.authRouter.post('/new-password', newPasswordValidation, recoveryCodeValidation, input_validation_middleware_1.rateLimiter, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let recoveryCodeEntity = yield recovery_codes_repository_1.recoveryCodesRepository.findByRecoveryCode(req.body.recoveryCode);
    if (!recoveryCodeEntity)
        return res.sendStatus(404);
    let user = yield users_service_1.usersService.findByEmail(recoveryCodeEntity.email);
    console.log('user /new-password', user);
    if (!user)
        return res.sendStatus(404);
    yield auth_service_1.authService.newPassword(user.id, req.body.newPassword);
    return res.sendStatus(204);
}));
exports.authRouter.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.sendStatus(401);
    const blackToken = yield blacktockens_repository_1.blackTokensRepository.check(refreshToken);
    if (blackToken)
        return res.sendStatus(401);
    const userId = yield jwt_utility_1.jwtUtility.getUserIdByToken(refreshToken);
    if (!userId)
        return res.sendStatus(401);
    const deviceId = yield jwt_utility_1.jwtUtility.getDeviceIdByToken(refreshToken);
    const session = yield device_auth_sessions_service_1.deviceAuthSessionsService.getSessionByUserId(userId);
    if (!session)
        return res.sendStatus(401);
    const deleteResult = yield device_auth_sessions_service_1.deviceAuthSessionsService.deleteSession(deviceId, userId);
    if (!deleteResult)
        return res.sendStatus(400);
    const addingResult = yield jwt_utility_1.jwtUtility.addToBlackList(refreshToken);
    if (!addingResult)
        return res.sendStatus(400);
    return res.status(204).cookie('refreshToken', '', {
        httpOnly: true,
        secure: true
    }).send({});
}));
exports.authRouter.get('/me', bearer_auth_middleware_1.bearerAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }
    const authType = req.headers.authorization.split(' ')[0];
    if (authType !== 'Bearer')
        return res.sendStatus(401);
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_utility_1.jwtUtility.getUserIdByToken(token);
    if (!userId)
        return res.sendStatus(401);
    const user = yield users_service_1.usersService.findById(userId);
    if (!user)
        return res.sendStatus(401);
    return res.status(200).send({
        email: user.email,
        login: user.login,
        userId: user.id
    });
}));
