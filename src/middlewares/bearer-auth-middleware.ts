import {NextFunction, Request, Response} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {usersService} from "../domain/users-service";

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtUtility.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.findById(userId)
        next()
    } else {
        res.send(401)
    }
}