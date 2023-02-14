import {Request, Response, Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {userCheckMiddleware} from "../middlewares/user-check-middleware";
import {PostsService} from "../domain/posts-service";
import {CommentsService} from "../domain/comments-service";
import {BlogsService} from "../domain/blogs-service";
import {PostModelClass} from "../repositories/db";
import {BlogsRepository} from "../repositories/blogs-repository";


export const postsRouter = Router({})

export const titleValidation = body('title')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 30})

export const descValidation = body('shortDescription')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 100})

export const contentValidation = body('content')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 1000})

export const blogIdValidation = body('blogId')
    .exists({checkFalsy: true})
    .custom(async (blogId, ) => {
        //todo how it's better to deal with blogService instance postRouter
        let blogsRepository = new BlogsRepository();
        let blogsService = new BlogsService(blogsRepository)

        const blogger = await blogsService.getBlogById(blogId)

        if (!blogger) {
            throw new Error('such blogger doesnt exist')
        }
        return true
    })

export const commentValidation = body('content')
    .exists({checkFalsy: true})
    .isString()
    .isLength({min: 20})
    .isLength({max: 300})

class PostsController {

    private postsService: PostsService
    private commentsService: CommentsService;
    constructor() {
        this.postsService = new PostsService()
        this.commentsService = new CommentsService()
    }

    async getPostComments(req: Request, res: Response) {
        const post = await this.postsService.getPostById(req.params.postId)
        if (!post) {
            res.sendStatus(404)
        } else {
            const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
            const pageSize = req.query.pageSize ? +req.query.pageSize : 10
            const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
            const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc'
            const comments = await this.commentsService.getPostComments(
                req.params.postId,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                req.user.id)
            res.status(200).send(comments)
        }
    }

    async createComment(req: Request, res: Response) {
        const post = await this.postsService.getPostById(req.params.postId)
        if (!post) {
            res.sendStatus(404)
        } else {
            const newComment = await this.commentsService.create(
                req.body.content,
                req.user!._id,
                req.params.postId)
            res.status(201).send(newComment)
        }
    }

    async getPosts(req: Request, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc'
        const posts = await this.postsService.getPosts(
            null,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)
        res.send(posts)
    }

    async createPost(req: Request, res: Response) {
        const newPost = await this.postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        if (newPost) {
            res.status(201).send(newPost)
        } else {
            res.status(400).json({
                errorsMessages: [{
                    "message": "no such bloggerId!!",
                    "field": "bloggerId"
                }]
            })
        }

    }

    async getPost(req: Request, res: Response) {
        const post = await this.postsService.getPostById(req.params.postId)
        if (post) {
            res.send(post)
        } else {
            res.send(404)
        }
    }

    async updatePost(req: Request, res: Response) {

        const postInstance = await PostModelClass.findOne({id: req.params.postId})
        if (!postInstance) return res.sendStatus(404)

        const updatedPostInstance = await this.postsService.updatePost(
            req.params.postId,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId
        )

        if (!updatedPostInstance) return res.sendStatus(400)

        return res.sendStatus(204)
    }

    async deletePost(req: Request, res: Response) {
        const isDeleted: boolean = await this.postsService.deletePost(req.params.postId)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }

}

const postsController = new PostsController()

postsRouter.get(
    '/:postId/comments',
    userCheckMiddleware,
    postsController.getPostComments.bind(postsController)
)
postsRouter.post(
    '/:postId/comments',
    bearerAuthMiddleware,
    commentValidation,
    inputValidationMiddleware,
    postsController.createComment.bind(postsController)
)
postsRouter.get(
    '/',
    postsController.getPosts.bind(postsController)
)
postsRouter.post(
    '/',
    authMiddleware,
    descValidation,
    titleValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController)
)
postsRouter.get(
    '/:postId',
    postsController.getPost.bind(postsController)
)

postsRouter.put(
    '/:postId',
    authMiddleware,
    descValidation,
    titleValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    postsController.updatePost.bind(postsController)
)
postsRouter.delete(
    '/:postId',
    authMiddleware,
    postsController.deletePost.bind(postsController)
)

