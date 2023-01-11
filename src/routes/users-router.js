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
exports.usersRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const express_validator_1 = require("express-validator");
const users_service_1 = require("../domain/users-service");
exports.usersRouter = (0, express_1.Router)({});
const loginValidation = (0, express_validator_1.body)('login')
    .exists()
    .isString()
    .trim()
    .isLength({ min: 3 })
    .isLength({ max: 10 });
const passwordValidation = (0, express_validator_1.body)('password')
    .exists()
    .isString()
    .trim()
    .isLength({ min: 6 })
    .isLength({ max: 20 });
const emailValidation = (0, express_validator_1.body)('email')
    .trim()
    .exists({ checkFalsy: true })
    .isString();
//.matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
exports.usersRouter.post('/', auth_middleware_1.authMiddleware, loginValidation, passwordValidation, emailValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield users_service_1.usersService.create(req.body.login, req.body.password, req.body.email);
    return res.status(201).send(newUser);
}));
exports.usersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc';
    const users = yield users_service_1.usersService.getUsers((_a = req.query.searchLoginTerm) === null || _a === void 0 ? void 0 : _a.toString(), (_b = req.query.searchEmailTerm) === null || _b === void 0 ? void 0 : _b.toString(), pageNumber, pageSize, sortBy, sortDirection);
    return res.send(users);
}));
exports.usersRouter.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield users_service_1.usersService.delete(req.params.id);
    if (isDeleted) {
        return res.sendStatus(204);
    }
    else {
        return res.sendStatus(404);
    }
}));
