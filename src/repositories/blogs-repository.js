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
exports.blogsRepository = void 0;
const db_1 = require("./db");
exports.blogsRepository = {
    getBlogs(searchTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (searchTerm) {
                filter.name = { $regex: searchTerm, $options: 'i' };
            }
            //todo instance method for case insensitive regex query
            //let totalCount = await BlogModelClass.caseInsRegexQuery(searchTerm).count()
            let totalCount = yield db_1.BlogModelClass.count(filter);
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
            let query = db_1.BlogModelClass.
                find().
                select('-_id').
                sort(sortFilter).
                skip((pageNumber - 1) * pageSize).
                limit(pageSize);
            if (searchTerm) {
                //todo case insensitive
                query = query.find({ name: { $regex: searchTerm, $options: 'i' } }).lean();
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
    getBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.BlogModelClass.findOne({ id: blogId }).lean();
        });
    },
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlogInstance = new db_1.BlogModelClass();
            newBlogInstance._id = newBlog._id;
            newBlogInstance.id = newBlog.id;
            newBlogInstance.name = newBlog.name;
            newBlogInstance.websiteUrl = newBlog.websiteUrl;
            newBlogInstance.description = newBlog.description;
            newBlogInstance.createdAt = newBlog.createdAt;
            yield newBlogInstance.save();
            //await BlogModelClass.create(newBlog)
            return newBlog;
        });
    },
    updateBlog(blogId, name, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogInstance = yield db_1.BlogModelClass.findOne({ id: blogId });
            if (!blogInstance)
                return false;
            blogInstance.name = name;
            blogInstance.websiteUrl = websiteUrl;
            yield blogInstance.save();
            // let result = await BlogModelClass.updateOne({id: blogId}, {$set: {name, websiteUrl}})
            return true;
        });
    },
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogInstance = yield db_1.BlogModelClass.findOne({ id: blogId });
            if (!blogInstance)
                return false;
            yield blogInstance.deleteOne();
            //let result = await BlogModelClass.deleteOne({id: blogId})
            return true;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.BlogModelClass.deleteMany();
        });
    }
};
