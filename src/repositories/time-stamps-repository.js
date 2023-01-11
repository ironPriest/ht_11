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
exports.timeStampsRepository = void 0;
const db_1 = require("./db");
const date_fns_1 = require("date-fns");
exports.timeStampsRepository = {
    add(newTimeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            //await TimeStampModelClass.insertOne(timeStamp)
            const newTimeStampInstance = new db_1.TimeStampModelClass();
            newTimeStampInstance._id = newTimeStamp._id;
            newTimeStampInstance.route = newTimeStamp.route;
            newTimeStampInstance.ip = newTimeStamp.ip;
            newTimeStampInstance.timeStamp = newTimeStamp.timeStamp;
            yield newTimeStampInstance.save();
            return true;
        });
    },
    getTimeStampsQuantity(route, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.TimeStampModelClass.countDocuments({ route, ip });
        });
    },
    cleanStamps(route, ip, timeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.TimeStampModelClass.deleteMany({ route, ip, timeStamp: { $lt: (0, date_fns_1.sub)(timeStamp, { seconds: 10 }) } });
            //todo --> how to implement with mongoose
            // await TimeStampModelClass.
            //     deleteMany({route, ip}).
            //     where('timeStamp').lt(sub(timeStamp, {seconds: 10}))
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.TimeStampModelClass.deleteMany();
        });
    }
};
