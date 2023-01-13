import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/comments-repository";
import {usersRepository} from "../repositories/users-repository";
import {CommentType, UserType} from "../types/types";
import {v4} from "uuid";

class CommentsService {
    async create(
        content: string,
        userId: ObjectId,
        postId: string
    ): Promise<Omit<CommentType, "_id" | "postId"> | null> {
        const user: UserType | null = await usersRepository.findById(userId)
        //todo --> nested object creation syntax
        let likesCount: number = 0
        let dislikesCount: number = 0
        let myStatus: string = 'None'
        let newComment = new CommentType(
            new ObjectId(),
            v4(),
            content,
            user!.id,
            user!.login,
            new Date(),
            postId,
            {
                likesCount,
                dislikesCount,
                myStatus
            }
        )

        let res = await commentsRepository.create(newComment)
        if (!res) return null

        return {
            id: newComment.id,
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            createdAt: newComment.createdAt,
            likesInfo: newComment.likesInfo
        }
    }

    async getPostComments(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {
        return await commentsRepository.findPostComments(
            postId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        )
    }

    async updateLike(id: string, likeStatus: string): Promise<boolean> {
        return commentsRepository.updateLike(id, likeStatus)
    }

    async updateComment(id: string, content: string) {
        return commentsRepository.updateComment(id, content)
    }

    async delete(id: string): Promise<boolean> {
        return await commentsRepository.delete(id)
    }

    async getCommentById(id: string): Promise<CommentType | null> {
        return await commentsRepository.findCommentById(id)
    }
}

export const commentsService = new CommentsService()