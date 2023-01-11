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
exports.postsRepository = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
exports.postsRepository = {
    getPosts(blogId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            let totalCount = yield db_1.PostModelClass.count();
            let pageCount = Math.ceil(+totalCount / pageSize);
            const sortFilter = {};
            switch (sortDirection) {
                case ('Asc'):
                    sortFilter[sortBy] = 1;
                    break;
                case ('Desc'):
                    sortFilter[sortBy] = -1;
                    break;
            }
            let query = db_1.PostModelClass.
                find().
                select('-_id').
                sort(sortFilter).
                skip((pageNumber - 1) * pageSize).
                limit(pageSize);
            if (blogId) {
                query = query.find({ blogId });
            }
            return {
                "pagesCount": pageCount,
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": totalCount,
                "items": yield query
            };
        });
    },
    //todo what better: id vs postId
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.PostModelClass.findOne({ id: postId }).lean();
        });
    },
    createPost(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let blogInstance = yield db_1.BlogModelClass.findOne({ id: blogId });
            if (!blogInstance)
                return null;
            // let newPost: PostType
            // await PostModelClass.create( newPost = {
            //         _id: new ObjectId(),
            //         id: v4(),
            //         title: title,
            //         shortDescription: shortDescription,
            //         content: content,
            //         blogId: blogId,
            //         bloggerName: blogger?.name,
            //         createdAt: new Date()
            // })
            const newPostInstance = new db_1.PostModelClass();
            newPostInstance._id = new mongodb_1.ObjectId();
            newPostInstance.id = (0, uuid_1.v4)();
            newPostInstance.title = title;
            newPostInstance.shortDescription = shortDescription;
            newPostInstance.content = content;
            newPostInstance.blogId = blogId;
            newPostInstance.blogName = blogInstance.name;
            newPostInstance.createdAt = new Date();
            yield newPostInstance.save();
            return newPostInstance;
        });
    },
    updatePost(postId, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postInstance = yield db_1.PostModelClass.findOne({ id: postId });
            if (!postInstance)
                return false;
            // await PostModelClass.updateOne({id: postId}, {$set: {
            //     title: title,
            //         shortDescription: shortDescription,
            //         content: content,
            //         bloggerId: blogId
            // }})
            postInstance.title = title;
            postInstance.shortDescription = shortDescription;
            postInstance.content = content;
            postInstance.blogId = blogId;
            yield postInstance.save();
            return true;
        });
    },
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            // let result = await PostModelClass.deleteOne({id: postId})
            // return result.deletedCount === 1
            const postInstance = yield db_1.PostModelClass.findOne({ id: postId });
            if (!postInstance)
                return false;
            yield postInstance.deleteOne();
            return true;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.PostModelClass.deleteMany();
        });
    }
};
