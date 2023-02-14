import {CommentType} from "../types/types";
import {CommentModelClass} from "./db";
import {LikeStatusesRepository} from "./like-statuses-repository";

export class CommentsRepository {

    likeStatusesRepository: LikeStatusesRepository;
    constructor() {
        this.likeStatusesRepository = new LikeStatusesRepository()
    }

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

        let query = await CommentModelClass.
            find().
            where('postId').equals(postId).
            select('-_id -postId -__v').
            sort(sortFilter).
            skip((pageNumber - 1) * pageSize).
            limit(pageSize).lean()


        let mappedComments = await Promise.all(query.map(async  comment => {
            comment.likesInfo.likesCount = await this.likeStatusesRepository.likesCount(comment.id)
            comment.likesInfo.dislikesCount = await this.likeStatusesRepository.dislikesCount(comment.id)
            comment.likesInfo.myStatus = "None"
            if (userId) {
                let likeStatus = await this.likeStatusesRepository.getLikeStatus(userId, comment.id)
                if (!likeStatus) {
                    comment.likesInfo.myStatus = "None"
                } else {
                    comment.likesInfo.myStatus = likeStatus.likeStatus
                }
            }

            return comment

        }))

        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": mappedComments
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

    async deleteAll() {
        await CommentModelClass.deleteMany()
    }

}