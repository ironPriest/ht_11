import {BlogType} from "../types/types";
import {BlogModelClass} from "./db";

export class BlogsRepository {
    async getBlogs(
        searchTerm: string | undefined,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {
        const filter: any = {}
        if (searchTerm) {
            filter.name = {$regex: searchTerm, $options: 'i'}
        }

        //todo instance method for case insensitive regex query
        //let totalCount = await BlogModelClass.caseInsRegexQuery(searchTerm).count()
        let totalCount = await BlogModelClass.count(filter)
        let pageCount = Math.ceil( +totalCount / pageSize)
        const sortFilter: any = {}
        switch (sortDirection) {
            case ('Asc'): sortFilter[sortBy] = 1
                break
            case ('Desc'): sortFilter[sortBy] = -1
                break
        }

        let query = BlogModelClass.
        find().
        select('-_id').
        sort(sortFilter).
        skip((pageNumber - 1) * pageSize).
        limit(pageSize)

        if (searchTerm) {
            //todo case insensitive
            query = query.find({name: {$regex: searchTerm, $options: 'i'}}).lean()
        }

        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": await query
        }
    }
    async getBlogById(blogId: string): Promise<BlogType | null> {
        return BlogModelClass.findOne({id: blogId}).lean()
    }
    async createBlog(newBlog: BlogType): Promise<BlogType> {

        const newBlogInstance = new BlogModelClass(newBlog)

        await newBlogInstance.save()

        return newBlog
    }
    async updateBlog(blogId: string, name: string, websiteUrl: string): Promise<boolean> {

        const blogInstance = await  BlogModelClass.findOne({id: blogId})
        if (!blogInstance) return false

        blogInstance.name = name
        blogInstance.websiteUrl = websiteUrl

        await blogInstance.save()

        // let result = await BlogModelClass.updateOne({id: blogId}, {$set: {name, websiteUrl}})
        return  true
    }
    async deleteBlog(blogId: string): Promise<boolean> {

        const blogInstance = await  BlogModelClass.findOne({id: blogId})
        if (!blogInstance) return false

        await blogInstance.deleteOne()

        //let result = await BlogModelClass.deleteOne({id: blogId})
        return true
    }
    async deleteAll() {
        await BlogModelClass.deleteMany()
    }
}
