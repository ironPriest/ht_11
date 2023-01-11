import {BlogType} from "../types/types";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/blogs-repository"
import {v4} from 'uuid';

export const blogsService = {
    async getBlogs(
        searchTerm: string | undefined,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {
            return await blogsRepository.getBlogs(
                searchTerm,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection)
    },
    async getBlogById(bloggerId: string): Promise<Omit<BlogType, '_id'> | null> {
        let blogger: BlogType | null | void = await blogsRepository.getBlogById(bloggerId)
        if (blogger) {
            return {
                id: blogger.id,
                name: blogger.name,
                websiteUrl: blogger.websiteUrl,
                createdAt: blogger.createdAt,
                description: blogger.description
            }
        } else {
            return null
        }

    },
    async createBlog(name: string, websiteUrl: string, description: string): Promise<Omit<BlogType, "_id">> {
        let newBlog: BlogType = {
            _id: new ObjectId(),
            id: v4(),
            name: name,
            websiteUrl: websiteUrl,
            description: description,
            createdAt: new Date()
        }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return {
            id: createdBlog.id,
            name: createdBlog.name,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            description: createdBlog.description
        }
    },
    async updateBlog(blogId: string, name: string, websiteUrl: string): Promise<boolean> {
        return blogsRepository.updateBlog(blogId, name, websiteUrl)
    },
    async deleteBlog(blogId: string): Promise<boolean> {
        return blogsRepository.deleteBlog(blogId)
    }
}