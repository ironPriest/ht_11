import {NextFunction, Request, Response} from "express";

const ipBlackList = ['192.1681.1', /*'::ffff:127.0.0.1'*/]

export const ipCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const isInBlacklist = ipBlackList.find((el: string) => el === ip)
    if (isInBlacklist) {
        res.sendStatus(403)
        return
    }
    next()
}