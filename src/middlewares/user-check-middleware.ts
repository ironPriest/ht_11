import {NextFunction, Request, Response} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {usersService} from "../domain/users-service";

export const userCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('headers -->', req.headers)
    if (!req.headers.authorization) {
        next()
    }

    const token = req.headers.authorization!.split(' ')[1]

    const userId = await jwtUtility.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.findById(userId)
        next()
    } else {
        next()
    }
}