import {LikeStatus} from "../types/types";
import {ObjectId} from "mongodb";
import {LikeStatusesRepository} from "../repositories/like-statuses-repository";

export class LikeStatusesService {

    constructor(
        protected likeStatusesRepository: LikeStatusesRepository
    ) {
    }

    async create(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
        const newLikeStatus = new LikeStatus(
            new ObjectId(),
            userId,
            commentId,
            likeStatus
        )

        return await this.likeStatusesRepository.create(newLikeStatus)
    }

    async checkExistence(userId: string, commentId: string): Promise<LikeStatus | null> {
        return await this.likeStatusesRepository.getLikeStatus(userId, commentId);
    }

    async update(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
        return await this.likeStatusesRepository.update(userId, commentId, likeStatus);
    }

    async likesCount(commentId: string): Promise<number> {
        return await this.likeStatusesRepository.likesCount(commentId)
    }

    async dislikesCount(commentId: string): Promise<number> {
        return await this.likeStatusesRepository.dislikesCount(commentId)
    }

    async getMyStatus(userId: string, commentId: string): Promise<string | null> {
        const likeStatus = await this.likeStatusesRepository.getLikeStatus(userId, commentId)
        if (!likeStatus) return null
        return likeStatus.likeStatus
    }

}