import {Request, Response, Router} from "express";
import {commentsRouter} from "./comments-router";
import {blogsService} from "../domain/blogs-service";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";
import {usersRepository} from "../repositories/users-repository";
import {deviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {emailConfirmationRepository} from "../repositories/emailconfirmation-repository";
import {blackTokensRepository} from "../repositories/blacktockens-repository";
import {timeStampsRepository} from "../repositories/time-stamps-repository";
import {recoveryCodesRepository} from "../repositories/recovery-codes-repository";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAll()
    await commentsRepository.deleteAll()
    await emailConfirmationRepository.deleteAll()
    await blackTokensRepository.deleteAll()
    await deviceAuthSessionsRepository.deleteAll()
    await timeStampsRepository.deleteAll()
    await recoveryCodesRepository.deleteAll()

    res.sendStatus(204)
})