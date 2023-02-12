import {Request, Response, Router} from "express";
import {BlogsService} from "../domain/blogs-service";
import {body, param} from "express-validator";
import {
    inputValidationMiddleware,
    requestsCounterMiddleware
} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsService} from "../domain/posts-service";
import {contentValidation, descValidation, titleValidation} from "./posts-router";

export const blogsRouter = Router({})


blogsRouter.use(requestsCounterMiddleware)

const nameValidation = body('name')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 15})

const youtubeUrlValidation = body('websiteUrl')
    .trim()
    .bail()
    .exists({checkFalsy: true})
    .bail()
    .isLength({max: 100})
    .bail()
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

const bloggerIdValidation = param('blogId').custom(async (blogId, ) => {
    //todo how it's better to deal with blogService instance blogRouter
    let blogsService = new BlogsService()
    const blog = await blogsService.getBlogById(blogId)
    if (!blog) {
        throw new Error('such blog doesnt exist')
    }
    return true
})

class BlogsController {

    private blogsService: BlogsService
    constructor() {
        this.blogsService = new BlogsService()
    }

    async getBlogs(req: Request, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc'
        const blogs = await this.blogsService.getBlogs(
            req.query.searchNameTerm?.toString(),
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)
        res.send(blogs)
    }

    async createBlog(req: Request, res: Response) {
        const newBlogger = await this.blogsService.createBlog(
            req.body.name,
            req.body.websiteUrl,
            req.body.description)
        res.status(201).send(newBlogger)
    }

    async getBlogPosts(req: Request, res: Response) {
        let blog = await this.blogsService.getBlogById(req.params.blogId)
        if (blog) {
            const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
            const pageSize = req.query.pageSize ? +req.query.pageSize : 10
            const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
            const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc'
            const posts = await postsService.getPosts(
                req.params.blogId,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection)
            res.send(posts)
        } else {
            res.send(404)
        }
    }

    async createBlogPost(req: Request, res: Response) {
        const newPost = await postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.params.blogId)
        if (!newPost) return res.sendStatus(400)
        res.status(201).send(newPost)
    }

    async getBlog(req: Request, res: Response) {
        let blog = await this.blogsService.getBlogById(req.params.bloggerId)
        if (blog) {
            res.send(blog)
        } else {
            res.send(404)
        }
    }

    async updateBlog(req: Request, res: Response) {
        const isUpdated: boolean = await this.blogsService.updateBlog(
            req.params.blogId,
            req.body.name,
            req.body.youtubeUrl)
        if (isUpdated) {
            const blog = await this.blogsService.getBlogById(req.params.blogId)
            res.status(204).send(blog)
        } else {
            res.send(404)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        const isDeleted: boolean = await this.blogsService.deleteBlog(req.params.blogId)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
}

const blogsController = new BlogsController()

blogsRouter.get(
    '/',
    blogsController.getBlogs.bind(blogsController)
)
blogsRouter.post(
    '/',
    authMiddleware,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController)
)
blogsRouter.get(
    '/:blogId/posts',
    bloggerIdValidation,
    inputValidationMiddleware,
    blogsController.getBlogPosts.bind(blogsController)
)
blogsRouter.post(
    '/:blogId/posts',
    authMiddleware,
    descValidation,
    titleValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
    blogsController.createBlogPost.bind(blogsController)
)
blogsRouter.get(
    '/:blogId',
    blogsController.getBlog.bind(blogsController)
)
blogsRouter.put(
    '/:blogId',
    authMiddleware,
    youtubeUrlValidation,
    nameValidation,
    inputValidationMiddleware,
    blogsController.updateBlog.bind(blogsController)
)
blogsRouter.delete(
    '/:blogId',
    authMiddleware,
    blogsController.deleteBlog.bind(blogsController)
)