import {CommentType} from "../types/types";
import {CommentModelClass} from "./db";

export const commentsRepository = {
    async create(newComment: CommentType): Promise<CommentType> {

        const newCommentInstance = new CommentModelClass()
        newCommentInstance.id = newComment.id
        newCommentInstance.content = newComment.content
        newCommentInstance.userId = newComment.userId
        newCommentInstance.userLogin = newComment.userLogin
        newCommentInstance.createdAt = newComment.createdAt
        newCommentInstance.postId = newComment.postId

        await newCommentInstance.save()

        return newComment
    },
    async findPostComments(
            postId: string,
            pageNumber: number,
            pageSize: number,
            sortBy: string,
            sortDirection: string) {
        let totalCount = await CommentModelClass.count({postId})
        let pageCount = Math.ceil(+totalCount / pageSize)
        const sortFilter: any = {}
        switch (sortDirection) {
            case ('Asc'): sortFilter[sortBy] = 1
                break
            case ('Desc'): sortFilter[sortBy] = -1
                break
        }

        let query = CommentModelClass.
            find().
            where('postId').equals(postId).
            select('-_id -postId').
            sort(sortFilter).
            skip((pageNumber - 1) * pageSize).
            limit(pageSize)

        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": await query
        }
    },
    async findCommentById(id: string): Promise<Omit<CommentType, '_id, postId'> | null> {

        return CommentModelClass.
            findOne({id}).
            select('-_id -postId')
    },
    async updateComment(id: string, content: string): Promise<boolean> {

        const commentInstance = await CommentModelClass.findOne({id})
        if (!commentInstance) return false

        commentInstance.content = content

        await commentInstance.save()

        return true
    },
    async delete(id: string) {

        const commentInstance = await CommentModelClass.findOne({id})
        if (!commentInstance) return false

        await commentInstance.deleteOne()

        return true
    },
    async deleteAll() {
        await CommentModelClass.deleteMany()
    }
}