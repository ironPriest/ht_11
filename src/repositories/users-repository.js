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
exports.usersRepository = void 0;
const db_1 = require("./db");
exports.usersRepository = {
    create(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUserInstance = new db_1.UserModelClass();
            newUserInstance._id = newUser._id;
            newUserInstance.id = newUser.id;
            newUserInstance.login = newUser.login;
            newUserInstance.passwordHash = newUser.passwordHash;
            newUserInstance.email = newUser.email;
            newUserInstance.createdAt = newUser.createdAt;
            yield newUserInstance.save();
            return newUser;
        });
    },
    newPassword(id, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInstance = yield db_1.UserModelClass.findOne({ id });
            if (!userInstance)
                return false;
            userInstance.passwordHash = passwordHash;
            yield userInstance.save();
            return true;
        });
    },
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.UserModelClass.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] }).lean();
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.UserModelClass.findOne({ _id: id }).lean();
        });
    },
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.UserModelClass.findOne({ email: email }).lean();
        });
    },
    getUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginFilter = {};
            const emailFilter = {};
            if (searchLoginTerm) {
                loginFilter.login = { $regex: searchLoginTerm, $options: 'i' };
            }
            if (searchEmailTerm) {
                emailFilter.email = { $regex: searchEmailTerm, $options: 'i' };
            }
            let totalCount = yield db_1.UserModelClass.count({ $or: [loginFilter, emailFilter] });
            let pageCount = Math.ceil(+totalCount / pageSize);
            const sortFilter = {};
            switch (sortDirection) {
                case ('Asc'):
                    sortFilter[sortBy] = 1;
                    break;
                case ('Desc'):
                    sortFilter[sortBy] = -1;
                    break;
            }
            let query = db_1.UserModelClass.
                find({ $or: [loginFilter, emailFilter] }).
                select('-_id -passwordHash').
                sort(sortFilter).
                skip((pageNumber - 1) * pageSize).
                limit(pageSize);
            return {
                "pagesCount": pageCount,
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": totalCount,
                "items": yield query
            };
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInstance = yield db_1.UserModelClass.findOne({ id });
            if (!userInstance)
                return false;
            yield userInstance.deleteOne();
            return true;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.UserModelClass.deleteMany();
        });
    }
};
