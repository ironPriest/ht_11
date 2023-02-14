import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {validationResult} from "express-validator";
import {TimeStampsRepository} from "../repositories/time-stamps-repository";
import {TimeStampType} from "../types/types";

const timeStampsRepository = new TimeStampsRepository()

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsHeap = errors.array({onlyFirstError: true}).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })

        if (errorsHeap[0].field === 'bloggerId') return res.status(404).json({errorsMessages: errorsHeap})

        res.status(400).json({errorsMessages: errorsHeap});
        return
    } else {
        next()
    }
}

let reqCounter = 0
export const requestsCounterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    reqCounter ++
    res.header('requests', reqCounter.toString())
    next()
}

export const contentChecker = (contentType: string) => (req: Request, res: Response, next: NextFunction) => {
    const contentToCheck = req.headers['content-type']
    if (contentToCheck === contentType) {
        next()
    } else {
        res.status(400).send('Bad content type')
    }
}

export  const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {

    const timeStamp = new TimeStampType(
        new ObjectId(),
        req.route.path,
        req.ip,
        new Date()
    )

    //TODO check result
    await timeStampsRepository.add(timeStamp)
    //TODO check result
    await timeStampsRepository.cleanStamps(req.route.path, req.ip, timeStamp.timeStamp)

    let timeStampsCounter = await timeStampsRepository.getTimeStampsQuantity(req.route.path, req.ip)
    if (timeStampsCounter > 5) return res.sendStatus(429)

    next()
}