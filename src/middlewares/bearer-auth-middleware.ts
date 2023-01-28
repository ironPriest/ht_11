import {NextFunction, Request, Response} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {usersService} from "../domain/users-service";

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const token = req.headers.authorization.split(' ')[1]
    console.log('token -->', token)

    const userId = await jwtUtility.getUserIdByToken(token)
    console.log('userId -->', userId)
    if (userId) {
        req.user = await usersService.findById(userId)
        next()
    } else {
        return res.sendStatus(401)
    }
}