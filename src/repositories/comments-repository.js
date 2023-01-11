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
exports.commentsRepository = void 0;
const db_1 = require("./db");
exports.commentsRepository = {
    create(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCommentInstance = new db_1.CommentModelClass();
            newCommentInstance.id = newComment.id;
            newCommentInstance.content = newComment.content;
            newCommentInstance.userId = newComment.userId;
            newCommentInstance.userLogin = newComment.userLogin;
            newCommentInstance.createdAt = newComment.createdAt;
            newCommentInstance.postId = newComment.postId;
            yield newCommentInstance.save();
            return newComment;
        });
    },
    findPostComments(postId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            let totalCount = yield db_1.CommentModelClass.count({ postId });
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
            let query = db_1.CommentModelClass.
                find().
                where('postId').equals(postId).
                select('-_id -postId').
                sort(sortFilter).
                skip((pageNumber - 1) * pageSize).
                limit(pageSize);
            return {
                "pagesCount": pageCount,
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": totalCount,
                "items": yield query
            };
        });
    },
    findCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.CommentModelClass.
                findOne({ id }).
                select('-_id -postId');
        });
    },
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentInstance = yield db_1.CommentModelClass.findOne({ id });
            if (!commentInstance)
                return false;
            commentInstance.content = content;
            yield commentInstance.save();
            return true;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentInstance = yield db_1.CommentModelClass.findOne({ id });
            if (!commentInstance)
                return false;
            yield commentInstance.deleteOne();
            return true;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.CommentModelClass.deleteMany();
        });
    }
};
