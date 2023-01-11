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
exports.blogsService = void 0;
const mongodb_1 = require("mongodb");
const blogs_repository_1 = require("../repositories/blogs-repository");
const uuid_1 = require("uuid");
exports.blogsService = {
    getBlogs(searchTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_1.blogsRepository.getBlogs(searchTerm, pageNumber, pageSize, sortBy, sortDirection);
        });
    },
    getBlogById(bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let blogger = yield blogs_repository_1.blogsRepository.getBlogById(bloggerId);
            if (blogger) {
                return {
                    id: blogger.id,
                    name: blogger.name,
                    websiteUrl: blogger.websiteUrl,
                    createdAt: blogger.createdAt,
                    description: blogger.description
                };
            }
            else {
                return null;
            }
        });
    },
    createBlog(name, websiteUrl, description) {
        return __awaiter(this, void 0, void 0, function* () {
            let newBlog = {
                _id: new mongodb_1.ObjectId(),
                id: (0, uuid_1.v4)(),
                name: name,
                websiteUrl: websiteUrl,
                description: description,
                createdAt: new Date()
            };
            const createdBlog = yield blogs_repository_1.blogsRepository.createBlog(newBlog);
            return {
                id: createdBlog.id,
                name: createdBlog.name,
                websiteUrl: createdBlog.websiteUrl,
                createdAt: createdBlog.createdAt,
                description: createdBlog.description
            };
        });
    },
    updateBlog(blogId, name, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.updateBlog(blogId, name, websiteUrl);
        });
    },
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.deleteBlog(blogId);
        });
    }
};
