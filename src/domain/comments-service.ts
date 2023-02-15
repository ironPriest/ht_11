import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-repository";
import {UsersRepository} from "../repositories/users-repository";
import {CommentType, UserType} from "../types/types";
import {v4} from "uuid";

export class CommentsService {

    constructor(
        protected usersRepository: UsersRepository,
        protected commentsRepository: CommentsRepository
    ) {
    }

    async create(
        content: string,
        commentatorId: ObjectId,
        postId: string
    ): Promise<Omit<CommentType, "_id" | "postId"> | null> {
        const user: UserType | null = await this.usersRepository.findById(commentatorId)
        //todo --> nested object creation syntax
        let userId = user!.id
        let userLogin = user!.login
        let likesCount: number = 0
        let dislikesCount: number = 0
        let myStatus: string = 'None'
        let newComment = new CommentType(
            new ObjectId(),
            v4(),
            content,
            {
                userId,
                userLogin
            },
            new Date(),
            postId,
            {
                likesCount,
                dislikesCount,
                myStatus
            }
        )

        let res = await this.commentsRepository.create(newComment)
        if (!res) return null

        return {
            id: newComment.id,
            content: newComment.content,
            commentatorInfo: {
                userId: newComment.commentatorInfo.userId,
                userLogin: newComment.commentatorInfo.userLogin
            },
            createdAt: newComment.createdAt,
            likesInfo: newComment.likesInfo
        }
    }

    async getPostComments(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        userId: string | undefined) {
        return await this.commentsRepository.findPostComments(
            postId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            userId
        )
    }

    //todo --> remove this
    async updateLike(id: string, likeStatus: string): Promise<boolean> {
        return this.commentsRepository.updateLike(id, likeStatus)
    }

    async updateComment(id: string, content: string) {
        return this.commentsRepository.updateComment(id, content)
    }

    async delete(id: string): Promise<boolean> {
        return await this.commentsRepository.delete(id)
    }

    async getCommentById(id: string): Promise<CommentType | null> {
        return await this.commentsRepository.findCommentById(id)
    }

}