"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    const userPassword = req.headers.authorization;
    if (userPassword === 'Basic YWRtaW46cXdlcnR5') {
        next();
    }
    else {
        res.send(401);
    }
};
exports.authMiddleware = authMiddleware;
