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
exports.rateLimiter = exports.contentChecker = exports.requestsCounterMiddleware = exports.inputValidationMiddleware = void 0;
const mongodb_1 = require("mongodb");
const express_validator_1 = require("express-validator");
const time_stamps_repository_1 = require("../repositories/time-stamps-repository");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsHeap = errors.array( /*{onlyFirstError: true}*/).map(e => {
            return {
                message: e.msg,
                field: e.param
            };
        });
        if (errorsHeap[0].field === 'bloggerId')
            return res.status(404).json({ errorsMessages: errorsHeap });
        res.status(400).json({ errorsMessages: errorsHeap });
        return;
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
let reqCounter = 0;
const requestsCounterMiddleware = (req, res, next) => {
    reqCounter++;
    res.header('requests', reqCounter.toString());
    next();
};
exports.requestsCounterMiddleware = requestsCounterMiddleware;
const contentChecker = (contentType) => (req, res, next) => {
    const contentToCheck = req.headers['content-type'];
    if (contentToCheck === contentType) {
        next();
    }
    else {
        res.status(400).send('Bad content type');
    }
};
exports.contentChecker = contentChecker;
const rateLimiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const timeStamp = {
        _id: new mongodb_1.ObjectId(),
        route: req.route.path,
        ip: req.ip,
        timeStamp: new Date()
    };
    //TODO check result
    yield time_stamps_repository_1.timeStampsRepository.add(timeStamp);
    //TODO check result
    yield time_stamps_repository_1.timeStampsRepository.cleanStamps(req.route.path, req.ip, timeStamp.timeStamp);
    let timeStampsCounter = yield time_stamps_repository_1.timeStampsRepository.getTimeStampsQuantity(req.route.path, req.ip);
    if (timeStampsCounter > 5)
        return res.sendStatus(429);
    next();
});
exports.rateLimiter = rateLimiter;
