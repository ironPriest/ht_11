import {NextFunction, Request, Response} from "express";
import {jwtUtility} from "../application/jwt-utility";
import {UsersService} from "../domain/users-service";

const usersService = new UsersService()

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtUtility.getUserIdByToken(token)

    if (userId) {
        req.user = await usersService.findById(userId)
        next()
    } else {
        return res.sendStatus(401)
    }

}