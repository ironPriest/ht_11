"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipCheckMiddleware = void 0;
const ipBlackList = ['192.1681.1', /*'::ffff:127.0.0.1'*/];
const ipCheckMiddleware = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const isInBlacklist = ipBlackList.find((el) => el === ip);
    if (isInBlacklist) {
        res.sendStatus(403);
        return;
    }
    next();
};
exports.ipCheckMiddleware = ipCheckMiddleware;
