import {NextFunction, Request, Response} from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userPassword = req.headers.authorization
    if (userPassword === 'Basic YWRtaW46cXdlcnR5') {
        next()
    } else {
        res.send(401)
    }
}