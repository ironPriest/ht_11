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
exports.postsService = void 0;
const posts_repository_1 = require("../repositories/posts-repository");
exports.postsService = {
    getPosts(blogId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.getPosts(blogId, pageNumber, pageSize, sortBy, sortDirection);
        });
    },
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield posts_repository_1.postsRepository.getPostById(postId);
            if (post) {
                return {
                    id: post.id,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt
                };
            }
            else {
                return null;
            }
        });
    },
    createPost(title, shortDescription, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPost = yield posts_repository_1.postsRepository.createPost(title, shortDescription, content, bloggerId);
            if (createdPost) {
                return {
                    id: createdPost.id,
                    title: createdPost.title,
                    shortDescription: createdPost.shortDescription,
                    content: createdPost.content,
                    blogId: createdPost.blogId,
                    blogName: createdPost.blogName,
                    createdAt: createdPost.createdAt
                };
            }
            else {
                return;
            }
        });
    },
    updatePost(postId, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repository_1.postsRepository.updatePost(postId, title, shortDescription, content, blogId);
        });
    },
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repository_1.postsRepository.deletePost(postId);
        });
    }
};
