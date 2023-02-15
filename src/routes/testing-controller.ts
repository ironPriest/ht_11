import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {EmailconfirmationRepository} from "../repositories/emailconfirmation-repository";
import {BlacktokensRepository} from "../repositories/blacktockens-repository";
import {DeviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";
import {TimeStampsRepository} from "../repositories/time-stamps-repository";
import {RecoveryCodesRepository} from "../repositories/recovery-codes-repository";
import {LikeStatusesRepository} from "../repositories/like-statuses-repository";
import {Request, Response} from "express";

export class TestingController {

    constructor(
        protected blogsRepository: BlogsRepository,
        protected postsRepository: PostsRepository,
        protected usersRepository: UsersRepository,
        protected commentsRepository: CommentsRepository,
        protected emailConfirmationRepository: EmailconfirmationRepository,
        protected blackTokensRepository: BlacktokensRepository,
        protected deviceAuthSessionsRepository: DeviceAuthSessionsRepository,
        protected timeStampsRepository: TimeStampsRepository,
        protected recoveryCodesRepository: RecoveryCodesRepository,
        protected likeStatusesRepository: LikeStatusesRepository
    ) {
    }

    async delete(req: Request, res: Response) {

        await this.blogsRepository.deleteAll()
        await this.postsRepository.deleteAll()
        await this.usersRepository.deleteAll()
        await this.commentsRepository.deleteAll()
        await this.emailConfirmationRepository.deleteAll()
        await this.blackTokensRepository.deleteAll()
        await this.deviceAuthSessionsRepository.deleteAll()
        await this.timeStampsRepository.deleteAll()
        await this.recoveryCodesRepository.deleteAll()
        await this.likeStatusesRepository.deleteAll()

        res.sendStatus(204)
    }

}