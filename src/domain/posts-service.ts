import {PostType} from "../types/types";
import {PostsRepository} from "../repositories/posts-repository";
import {v4} from "uuid";
import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/blogs-repository";

export class PostsService {


    constructor(
        protected blogsRepository: BlogsRepository,
        protected postsRepository: PostsRepository
    ) {
    }

    async getPosts(
        blogId: string | null,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {
        return await this.postsRepository.getPosts(
            blogId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)
    }

    async getPostById(postId: string): Promise<Omit<PostType, '_id'> | null> {
        let post: PostType | null = await this.postsRepository.getPostById(postId)
        if (post) {
            return {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }
        } else {
            return null
        }

    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<Omit<PostType, "_id"> | null> {

        const blog = await this.blogsRepository.getBlogById(blogId)
        if (!blog) return null

        const post = new PostType(
            new ObjectId(),
            v4(),
            title,
            shortDescription,
            content,
            blogId,
            blog.name,
            new Date().toISOString()
        )

        const createdPost = await this.postsRepository.createPost(post)

        if (createdPost) {
            return {
                id: createdPost.id,
                title: createdPost.title,
                shortDescription: createdPost.shortDescription,
                content: createdPost.content,
                blogId: createdPost.blogId,
                blogName: createdPost.blogName,
                createdAt: createdPost.createdAt
            }
        } else {
            return null
        }

    }

    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return this.postsRepository.updatePost(postId, title, shortDescription, content, blogId)
    }

    async deletePost(postId: string): Promise<boolean> {
        return this.postsRepository.deletePost(postId)
    }

}