"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_service_1 = require("../domain/blogs-service");
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const posts_service_1 = require("../domain/posts-service");
const posts_router_1 = require("./posts-router");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.use(input_validation_middleware_1.requestsCounterMiddleware);
const nameValidation = (0, express_validator_1.body)('name')
    .trim()
    .exists({ checkFalsy: true })
    .isLength({ max: 15 });
const youtubeUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .trim()
    .bail()
    .exists({ checkFalsy: true })
    .bail()
    .isLength({ max: 100 })
    .bail()
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$');
const bloggerIdValidation = (0, express_validator_1.param)('blogId').custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_service_1.blogsService.getBlogById(blogId);
    if (!blog) {
        throw new Error('such blog doesnt exist');
    }
    return true;
}));
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc';
    const blogs = yield blogs_service_1.blogsService.getBlogs((_a = req.query.searchNameTerm) === null || _a === void 0 ? void 0 : _a.toString(), pageNumber, pageSize, sortBy, sortDirection);
    res.send(blogs);
}));
exports.blogsRouter.get('/:blogId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let blog = yield blogs_service_1.blogsService.getBlogById(req.params.bloggerId);
    if (blog) {
        res.send(blog);
    }
    else {
        res.send(404);
    }
}));
exports.blogsRouter.get('/:blogId/posts', bloggerIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let blog = yield blogs_service_1.blogsService.getBlogById(req.params.blogId);
    if (blog) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc';
        const posts = yield posts_service_1.postsService.getPosts(req.params.blogId, pageNumber, pageSize, sortBy, sortDirection);
        res.send(posts);
    }
    else {
        res.send(404);
    }
}));
exports.blogsRouter.post('/', auth_middleware_1.authMiddleware, nameValidation, youtubeUrlValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlogger = yield blogs_service_1.blogsService.createBlog(req.body.name, req.body.websiteUrl, req.body.description);
    res.status(201).send(newBlogger);
}));
exports.blogsRouter.post('/:blogId/posts', auth_middleware_1.authMiddleware, posts_router_1.descValidation, posts_router_1.titleValidation, posts_router_1.contentValidation, bloggerIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield posts_service_1.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.bloggerId);
    res.status(201).send(newPost);
}));
exports.blogsRouter.put('/:blogId', auth_middleware_1.authMiddleware, youtubeUrlValidation, nameValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield blogs_service_1.blogsService.updateBlog(req.params.blogId, req.body.name, req.body.youtubeUrl);
    if (isUpdated) {
        const blog = yield blogs_service_1.blogsService.getBlogById(req.params.blogId);
        res.status(204).send(blog);
    }
    else {
        res.send(404);
    }
}));
exports.blogsRouter.delete('/:blogId', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blogs_service_1.blogsService.deleteBlog(req.params.blogId);
    if (isDeleted) {
        res.send(204);
    }
    else {
        res.send(404);
    }
}));
