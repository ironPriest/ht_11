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
exports.usersService = void 0;
const mongodb_1 = require("mongodb");
const users_repository_1 = require("../repositories/users-repository");
const auth_service_1 = require("./auth-service");
const uuid_1 = require("uuid");
// import {randomUUID} from "crypto";
// const uuidExample = randomUUID()
exports.usersService = {
    create(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield auth_service_1.authService._generateHash(password);
            let user = {
                _id: new mongodb_1.ObjectId(),
                id: (0, uuid_1.v4)(),
                login,
                passwordHash,
                email,
                createdAt: new Date()
            };
            let res = yield users_repository_1.usersRepository.create(user);
            if (!res) {
                console.log("error");
                return;
            }
            return {
                id: user.id,
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            };
        });
    },
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_repository_1.usersRepository.findById(userId);
            if (user) {
                return user;
            }
            else {
                return null;
            }
        });
    },
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_repository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (user) {
                return user;
            }
            else {
                return null;
            }
        });
    },
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_repository_1.usersRepository.findByEmail(email);
            if (user) {
                return user;
            }
            else {
                return null;
            }
        });
    },
    getUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_1.usersRepository.getUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection);
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.usersRepository.delete(id);
        });
    }
};
