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
exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_service_1 = require("../domain/comments-service");
const bearer_auth_middleware_1 = require("../middlewares/bearer-auth-middleware");
const posts_router_1 = require("./posts-router");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter
    .put('/:id', bearer_auth_middleware_1.bearerAuthMiddleware, posts_router_1.commentValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_service_1.commentsService.getCommentById(req.params.id);
    if (comment) {
        if (req.user.id !== comment.userId) {
            res.sendStatus(403);
        }
        else {
            const isUpdated = yield comments_service_1.commentsService.updateComment(req.params.id, req.body.content);
            if (isUpdated) {
                const comment = yield comments_service_1.commentsService.getCommentById(req.params.id);
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        }
    }
    else {
        res.sendStatus(404);
    }
}))
    .delete('/:id', bearer_auth_middleware_1.bearerAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_service_1.commentsService.getCommentById(req.params.id);
    if (comment) {
        if (req.user.id !== comment.userId) {
            res.sendStatus(403);
        }
        else {
            const isDeleted = yield comments_service_1.commentsService.delete(req.params.id);
            if (isDeleted) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        }
    }
    else {
        res.sendStatus(404);
    }
}))
    .get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_service_1.commentsService.getCommentById(req.params.id);
    if (comment) {
        res.status(200).send(comment);
    }
    else {
        res.sendStatus(404);
    }
}));
