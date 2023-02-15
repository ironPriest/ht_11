import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./routes/blogs-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./routes/posts-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./routes/comments-controller";
import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./routes/users-controller";
import {LikeStatusesRepository} from "./repositories/like-statuses-repository";
import {LikeStatusesService} from "./domain/like-statuses-service";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./routes/auth-controller";
import {EmailconfirmationRepository} from "./repositories/emailconfirmation-repository";
import {RecoveryCodesRepository} from "./repositories/recovery-codes-repository";
import {EmailService} from "./domain/email-service";
import {EmailManager} from "./managers/email-manager";
import {EmailAdapter} from "./adapters/email-adapter";
import {BlacktokensRepository} from "./repositories/blacktockens-repository";
import {JwtUtility} from "./application/jwt-utility";
import {DeviceAuthSessionsRepository} from "./repositories/device-auth-sessions-repository";
import {DeviceAuthSessionsService} from "./domain/device-auth-sessions-service";
import {SecurityDevicesController} from "./routes/security-devices-controller";
import {TestingController} from "./routes/testing-controller";
import {TimeStampsRepository} from "./repositories/time-stamps-repository";

const blogsRepository = new BlogsRepository()
const postsRepository = new PostsRepository()
const commentsRepository = new CommentsRepository()
const usersRepository = new UsersRepository()
const likeStatusesRepository = new LikeStatusesRepository()
const emailConfirmationRepository = new EmailconfirmationRepository()
const recoveryCodesRepository = new RecoveryCodesRepository()
const blackTokensRepository = new BlacktokensRepository()
const deviceAuthSessionsRepository = new DeviceAuthSessionsRepository()
const timeStampsRepository = new TimeStampsRepository()

const blogsService = new BlogsService(
    blogsRepository
)
const postsService = new PostsService(
    blogsRepository,
    postsRepository
)
const commentService = new CommentsService(
    usersRepository,
    commentsRepository
)
const emailAdapter = new EmailAdapter()
const emailManager = new EmailManager(
    emailAdapter
)
const emailService = new EmailService(
    emailManager
)
const authService = new AuthService(
    usersRepository,
    emailConfirmationRepository,
    recoveryCodesRepository,
    emailService
)
const usersService = new UsersService(
    usersRepository,
    authService
)
const likesStatusesService = new LikeStatusesService(
    likeStatusesRepository
)
const jwtUtility = new JwtUtility(
    blackTokensRepository
)
const deviceAuthSessionsService = new DeviceAuthSessionsService(
    deviceAuthSessionsRepository
)

export const blogsController = new BlogsController(
    blogsService,
    postsService
)
export const postsController = new PostsController(
    postsService,
    commentService
)
export const commentsController = new CommentsController(
    commentService,
    likesStatusesService
)
export const usersController = new UsersController(
    usersService
)
export const authController = new AuthController(
    usersService,
    blackTokensRepository,
    jwtUtility,
    deviceAuthSessionsService,
    recoveryCodesRepository,
    authService
)
export const securityDeviceController = new SecurityDevicesController(
    jwtUtility,
    blackTokensRepository,
    deviceAuthSessionsRepository,
    deviceAuthSessionsService
)
export const testingController = new TestingController(
    blogsRepository,
    postsRepository,
    usersRepository,
    commentsRepository,
    emailConfirmationRepository,
    blackTokensRepository,
    deviceAuthSessionsRepository,
    timeStampsRepository,
    recoveryCodesRepository,
    likeStatusesRepository
)
