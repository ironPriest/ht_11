import {Request, Response, Router} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";
import {DeviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {EmailconfirmationRepository} from "../repositories/emailconfirmation-repository";
import {BlacktokensRepository} from "../repositories/blacktockens-repository";
import {timeStampsRepository} from "../repositories/time-stamps-repository";
import {recoveryCodesRepository} from "../repositories/recovery-codes-repository";
import {likeStatusesRepository} from "../repositories/like-statuses-repository";

export const testingRouter = Router({})

class TestingController {

    private blogsRepository: BlogsRepository;
    private postsRepository: PostsRepository;
    private usersRepository: UsersRepository;
    private commentsRepository: CommentsRepository;
    private emailConfirmationRepository: EmailconfirmationRepository;
    private blackTokensRepository: BlacktokensRepository;
    private deviceAuthSessionsRepository: DeviceAuthSessionsRepository;
    constructor() {
        this.blogsRepository = new BlogsRepository()
        this.postsRepository = new PostsRepository()
        this.usersRepository = new UsersRepository()
        this.commentsRepository = new CommentsRepository()
        this.emailConfirmationRepository = new EmailconfirmationRepository()
        this.blackTokensRepository = new BlacktokensRepository()
        this.deviceAuthSessionsRepository = new DeviceAuthSessionsRepository()
    }

    async delete(req: Request, res: Response) {

        await this.blogsRepository.deleteAll()
        await this.postsRepository.deleteAll()
        await this.usersRepository.deleteAll()
        await this.commentsRepository.deleteAll()
        await this.emailConfirmationRepository.deleteAll()
        await this.blackTokensRepository.deleteAll()
        await this.deviceAuthSessionsRepository.deleteAll()
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