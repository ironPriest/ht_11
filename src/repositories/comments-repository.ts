import {CommentType} from "../types/types";
import {CommentModelClass} from "./db";
import {likeStatusesRepository} from "./like-statuses-repository";

class CommentsRepository {
    async create(newComment: CommentType): Promise<boolean> {

        const newCommentInstance = new CommentModelClass(newComment)
        console.log('new comment in repo -->', newCommentInstance)

        await newCommentInstance.save().catch(err => console.log('saving comment in repo error -->', err))

        return true
    }

    async findPostComments(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        userId: string | undefined
    ) {
        let totalCount = await CommentModelClass.count({postId})
        let pageCount = Math.ceil(+totalCount / pageSize)
        const sortFilter: any = {}
        switch (sortDirection) {
            case ('Asc'):
                sortFilter[sortBy] = 1
                break
            case ('Desc'):
                sortFilter[sortBy] = -1
                break
        }

        let query = CommentModelClass.
            find().
            where('postId').equals(postId).
            select('-_id -postId -__v').
            sort(sortFilter).
            skip((pageNumber - 1) * pageSize).
            limit(pageSize)

        let queryRes = await query

        let mappedComments = Promise.all(queryRes.map(async  comment => {
            comment.likesInfo.likesCount = await likeStatusesRepository.likesCount(comment.id)
            comment.likesInfo.dislikesCount = await likeStatusesRepository.dislikesCount(comment.id)
            comment.likesInfo.myStatus = "None"
            if (userId) {
                let likeStatus = await likeStatusesRepository.getLikeStatus(userId, comment.id)
                if (!likeStatus) {
                    comment.likesInfo.myStatus = "None"
                } else {
                    comment.likesInfo.myStatus = likeStatus.likeStatus
                }
            }

        }))

        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": await mappedComments
        }
    }

    async updateLike(id: string, likeStatus: string): Promise<boolean> {

        const commentInstance = await CommentModelClass.findOne({id})
        if (!commentInstance) return false

        commentInstance.likesInfo.myStatus = likeStatus

        await commentInstance.save()

        return true

    }

    async updateComment(id: string, content: string): Promise<boolean> {

        const commentInstance = await CommentModelClass.findOne({id})
        if (!commentInstance) return false

        commentInstance.content = content

        await commentInstance.save()

        return true
    }

    async delete(id: string) {

        const commentInstance = await CommentModelClass.findOne({id})
        if (!commentInstance) return false

        await commentInstance.deleteOne()

        return true
    }

    async findCommentById(id: string): Promise<Omit<CommentType, '_id, postId'> | null> {

        return CommentModelClass.
            findOne({id}).
            select('-__v -_id -postId').
            lean()

    }

    // async countLikes(id: string, likeStatus: string): Promise<boolean> {
    //
    //     const comment = await CommentModelClass.findOne({id})
    //     if (!comment) return false
    //
    //     switch (likeStatus) {
    //         case 'Like':
    //             comment.likesInfo.likesCount++
    //             break
    //         case 'Dislike':
    //             comment.likesInfo.dislikesCount++
    //             break
    //     }
    //
    //     return true
    // }

    async deleteAll() {
        await CommentModelClass.deleteMany()
    }
}

export const commentsRepository = new CommentsRepository()