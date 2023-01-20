import {LikeStatus} from "../types/types";
import {ObjectId} from "mongodb";
import {likeStatusesRepository} from "../repositories/like-statuses-repository";

class LikeStatusesService {
    async create(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
        const newLikeStatus = new LikeStatus(
            new ObjectId(),
            userId,
            commentId,
            likeStatus
        )

        //await commentsRepository.countLikes(commentId, likeStatus)

        return await likeStatusesRepository.create(newLikeStatus)
    }

    async checkExistence(userId: string, commentId: string): Promise<LikeStatus | null> {
        return await likeStatusesRepository.getLikeStatus(userId, commentId);
    }

    async update(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
        return await likeStatusesRepository.update(userId, commentId, likeStatus);
    }

    async likesCount(commentId: string): Promise<number> {
        return await likeStatusesRepository.likesCount(commentId)
    }

    async dislikesCount(commentId: string): Promise<number> {
        return await likeStatusesRepository.dislikesCount(commentId)
    }

    async getMyStatus(userId: string, commentId: string): Promise<string | null> {
        const likeStatus = await likeStatusesRepository.getLikeStatus(userId, commentId)
        if (!likeStatus) return null
        return likeStatus.likeStatus
    }
}

export const likesStatusesService = new LikeStatusesService()