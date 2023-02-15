import {Router} from "express";
import {BlogsService} from "../domain/blogs-service";
import {body, param} from "express-validator";
import {inputValidationMiddleware, requestsCounterMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {contentValidation, descValidation, titleValidation} from "./posts-router";
import {BlogsRepository} from "../repositories/blogs-repository";
import {blogsController} from "../composition-root";

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

    //todo how it's better to deal with blogService instance (blogsRouter)
    let blogsRepository = new BlogsRepository();
    let blogsService = new BlogsService(blogsRepository)

    const blog = await blogsService.getBlogById(blogId)
    if (!blog) {
        throw new Error('such blog doesnt exist')
    }
    return true
})

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