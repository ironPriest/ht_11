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
exports.testingRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const posts_repository_1 = require("../repositories/posts-repository");
const users_repository_1 = require("../repositories/users-repository");
const device_auth_sessions_repository_1 = require("../repositories/device-auth-sessions-repository");
const comments_repository_1 = require("../repositories/comments-repository");
const emailconfirmation_repository_1 = require("../repositories/emailconfirmation-repository");
const blacktockens_repository_1 = require("../repositories/blacktockens-repository");
const time_stamps_repository_1 = require("../repositories/time-stamps-repository");
const recovery_codes_repository_1 = require("../repositories/recovery-codes-repository");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_repository_1.blogsRepository.deleteAll();
    yield posts_repository_1.postsRepository.deleteAll();
    yield users_repository_1.usersRepository.deleteAll();
    yield comments_repository_1.commentsRepository.deleteAll();
    yield emailconfirmation_repository_1.emailConfirmationRepository.deleteAll();
    yield blacktockens_repository_1.blackTokensRepository.deleteAll();
    yield device_auth_sessions_repository_1.deviceAuthSessionsRepository.deleteAll();
    yield time_stamps_repository_1.timeStampsRepository.deleteAll();
    yield recovery_codes_repository_1.recoveryCodesRepository.deleteAll();
    res.sendStatus(204);
}));
