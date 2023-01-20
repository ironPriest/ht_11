import {CommentModelClass, LikeStatusModelClass} from "./db";
import {LikeStatus} from "../types/types";

class LikeStatusesRepository {
    async create(newLikeStatus: LikeStatus): Promise<boolean> {

        const newLikeStatusInstance = new LikeStatusModelClass(newLikeStatus)

        // newLikeStatusInstance.userId = newLikeStatus.userId
        // newLikeStatusInstance.commentId = newLikeStatus.commentId
        // newLikeStatusInstance.likeStatus = newLikeStatus.likeStatus

        await newLikeStatusInstance.save()

        return true
    }

    async checkExistence(userId: string, commentId: string): Promise<boolean> {

        const likeStatus = await LikeStatusModelClass.
            findOne().
            where('userId').equals(userId).
            where('commentId').equals(commentId).
            lean()
        if (!likeStatus) return false

        return true
    }

    async update(userId: string, commentId: string, likeStatus: string): Promise<boolean> {

        const likeStatusInstance = await LikeStatusModelClass.
        findOne().
        where('userId').equals(userId).
        where('commentId').equals(commentId)

        if (!likeStatusInstance) return false

        likeStatusInstance.likeStatus = likeStatus
        await likeStatusInstance.save()

        return true
    }

    async likesCount(commentId: string): Promise<number> {
        return LikeStatusModelClass.count({commentId, likeStatus: 'Like'})
    }

    async dislikesCount(commentId: string): Promise<number> {
        return LikeStatusModelClass.count({commentId, likeStatus: 'Dislike'})
    }

    async deleteAll() {
        await LikeStatusModelClass.deleteMany()
    }
}

export const likeStatusesRepository = new LikeStatusesRepository()