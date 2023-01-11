import {PostType} from "../types/types";
import {postsRepository} from "../repositories/posts-repository";

export const postsService = {
    async getPosts(
        blogId: string | null,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {
            return await postsRepository.getPosts(
                blogId,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection)
    },
    async getPostById(postId: string): Promise<Omit<PostType, '_id'> | null> {
        let post: PostType | null = await postsRepository.getPostById(postId)
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

    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<Omit<PostType, "_id"> | undefined> {
        const createdPost = await postsRepository.createPost(title, shortDescription, content, bloggerId)
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
            return
        }

    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return postsRepository.updatePost(postId, title, shortDescription, content, blogId)
    },
    async deletePost(postId: string): Promise<boolean> {
        return postsRepository.deletePost(postId)
    }
}