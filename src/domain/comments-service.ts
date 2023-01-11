import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/comments-repository";
import {usersRepository} from "../repositories/users-repository";
import {CommentType, UserType} from "../types/types";
import {v4} from "uuid";

export const commentsService = {
    async create(content: string, userId: ObjectId, postId: string): Promise<Omit<CommentType, "_id" | "postId">> {
        const user: UserType | void | null = await usersRepository.findById(userId)
        let comment: CommentType = {
            _id: new ObjectId(),
            id: v4(),
            content: content,
            userId: user!.id,
            userLogin: user!.login,
            createdAt: new Date(),
            postId: postId
        }
        const createdComment = await commentsRepository.create(comment)
        return {
            id: createdComment.id,
            content: createdComment.content,
            userId: createdComment.userId,
            userLogin: createdComment.userLogin,
            createdAt: createdComment.createdAt
        }
    },
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
            sortDirection)
    },
    async getCommentById(id: string) {
        return await commentsRepository.findCommentById(id)
    },
    async updateComment(id: string, content: string) {
        return commentsRepository.updateComment(id, content)
    },
    async delete(id: string): Promise<boolean> {
        return await commentsRepository.delete(id)
    }
}