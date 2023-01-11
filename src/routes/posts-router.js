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
exports.commentValidation = exports.blogIdValidation = exports.contentValidation = exports.descValidation = exports.titleValidation = exports.postsRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const bearer_auth_middleware_1 = require("../middlewares/bearer-auth-middleware");
const posts_service_1 = require("../domain/posts-service");
const comments_service_1 = require("../domain/comments-service");
const blogs_service_1 = require("../domain/blogs-service");
const db_1 = require("../repositories/db");
exports.postsRouter = (0, express_1.Router)({});
exports.titleValidation = (0, express_validator_1.body)('title')
    .trim()
    .exists({ checkFalsy: true })
    .isLength({ max: 30 });
exports.descValidation = (0, express_validator_1.body)('shortDescription')
    .trim()
    .exists({ checkFalsy: true })
    .isLength({ max: 100 });
exports.contentValidation = (0, express_validator_1.body)('content')
    .trim()
    .exists({ checkFalsy: true })
    .isLength({ max: 1000 });
exports.blogIdValidation = (0, express_validator_1.body)('blogId')
    .exists({ checkFalsy: true })
    .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blogger = yield blogs_service_1.blogsService.getBlogById(blogId);
    if (!blogger) {
        throw new Error('such blogger doesnt exist');
    }
    return true;
}));
exports.commentValidation = (0, express_validator_1.body)('content')
    .exists({ checkFalsy: true })
    .isString()
    .isLength({ min: 20 })
    .isLength({ max: 300 });
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc';
    const posts = yield posts_service_1.postsService.getPosts(null, pageNumber, pageSize, sortBy, sortDirection);
    res.send(posts);
}));
exports.postsRouter.get('/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_service_1.postsService.getPostById(req.params.postId);
    if (post) {
        res.send(post);
    }
    else {
        res.send(404);
    }
}));
exports.postsRouter.post('/', auth_middleware_1.authMiddleware, exports.descValidation, exports.titleValidation, exports.contentValidation, exports.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield posts_service_1.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (newPost) {
        res.status(201).send(newPost);
    }
    else {
        res.status(400).json({
            errorsMessages: [{
                    "message": "no such bloggerId!!",
                    "field": "bloggerId"
                }]
        });
    }
}));
exports.postsRouter.put('/:postId', auth_middleware_1.authMiddleware, exports.descValidation, exports.titleValidation, exports.contentValidation, exports.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postInstance = yield db_1.PostModelClass.findOne({ id: req.params.postId });
    if (!postInstance)
        return res.sendStatus(404);
    const updatedPostInstance = yield posts_service_1.postsService.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (!updatedPostInstance)
        return res.sendStatus(400);
    return res.sendStatus(204);
}));
exports.postsRouter.delete('/:postId', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield posts_service_1.postsService.deletePost(req.params.postId);
    if (isDeleted) {
        res.send(204);
    }
    else {
        res.send(404);
    }
}));
exports.postsRouter.post('/:postId/comments', bearer_auth_middleware_1.bearerAuthMiddleware, exports.commentValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_service_1.postsService.getPostById(req.params.postId);
    if (!post) {
        res.sendStatus(404);
    }
    else {
        const newComment = yield comments_service_1.commentsService.create(req.body.content, req.user._id, req.params.postId);
        res.status(201).send(newComment);
    }
}));
exports.postsRouter.get('/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_service_1.postsService.getPostById(req.params.postId);
    if (!post) {
        res.sendStatus(404);
    }
    else {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc';
        const comments = yield comments_service_1.commentsService.getPostComments(req.params.postId, pageNumber, pageSize, sortBy, sortDirection);
        res.status(200).send(comments);
    }
}));
