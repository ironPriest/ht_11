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
exports.commentsService = void 0;
const mongodb_1 = require("mongodb");
const comments_repository_1 = require("../repositories/comments-repository");
const users_repository_1 = require("../repositories/users-repository");
const uuid_1 = require("uuid");
exports.commentsService = {
    create(content, userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(userId);
            let comment = {
                _id: new mongodb_1.ObjectId(),
                id: (0, uuid_1.v4)(),
                content: content,
                userId: user.id,
                userLogin: user.login,
                createdAt: new Date(),
                postId: postId
            };
            const createdComment = yield comments_repository_1.commentsRepository.create(comment);
            return {
                id: createdComment.id,
                content: createdComment.content,
                userId: createdComment.userId,
                userLogin: createdComment.userLogin,
                createdAt: createdComment.createdAt
            };
        });
    },
    getPostComments(postId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.findPostComments(postId, pageNumber, pageSize, sortBy, sortDirection);
        });
    },
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.findCommentById(id);
        });
    },
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_repository_1.commentsRepository.updateComment(id, content);
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.delete(id);
        });
    }
};
