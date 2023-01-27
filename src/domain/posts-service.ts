import {PostType} from "../types/types";
import {postsRepository} from "../repositories/posts-repository";

class PostsService {
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
    }
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

    }
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<Omit<PostType, "_id"> | null> {
        const createdPost = await postsRepository.createPost(title, shortDescription, content, blogId)
        console.log('created post in service -->', createdPost)
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
        return postsRepository.updatePost(postId, title, shortDescription, content, blogId)
    }
    async deletePost(postId: string): Promise<boolean> {
        return postsRepository.deletePost(postId)
    }
}

export const postsService = new PostsService()