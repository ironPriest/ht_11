import {Request, Response, Router} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";
import {usersRepository} from "../repositories/users-repository";
import {deviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {emailConfirmationRepository} from "../repositories/emailconfirmation-repository";
import {blackTokensRepository} from "../repositories/blacktockens-repository";
import {timeStampsRepository} from "../repositories/time-stamps-repository";
import {recoveryCodesRepository} from "../repositories/recovery-codes-repository";
import {likeStatusesRepository} from "../repositories/like-statuses-repository";

export const testingRouter = Router({})

class TestingController {

    private blogsRepository: BlogsRepository;
    constructor() {
        this.blogsRepository = new BlogsRepository()
    }

    async delete(req: Request, res: Response) {

        await this.blogsRepository.deleteAll()
        await postsRepository.deleteAll()
        await usersRepository.deleteAll()
        await commentsRepository.deleteAll()
        await emailConfirmationRepository.deleteAll()
        await blackTokensRepository.deleteAll()
        await deviceAuthSessionsRepository.deleteAll()
        await timeStampsRepository.deleteAll()
        await recoveryCodesRepository.deleteAll()
        await likeStatusesRepository.deleteAll()

        res.sendStatus(204)
    }

}

const testingController = new TestingController()

testingRouter.delete(
    '/all-data',
    testingController.delete.bind(testingController)
)