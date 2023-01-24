import {NextFunction, Request, Response} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {usersService} from "../domain/users-service";
import {resolveObjectURL} from "buffer";

export const userCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('headers -->', req.headers)
    try {
        const auth = req.headers.authorization
        const token = auth!.split(' ')[1]
        const userId = await jwtUtility.getUserIdByToken(token)
        req.user = await usersService.findById(userId)
        return next()
    }
    catch (e) {
        req.user = null
        return next()
    }
}