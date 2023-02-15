import {CommentsService} from "../domain/comments-service";
import {LikeStatusesService} from "../domain/like-statuses-service";
import {Request, Response} from "express";

export class CommentsController {

    constructor(
        protected commentsService: CommentsService,
        protected likesStatusesService: LikeStatusesService
    ) {
    }

    async updateLike(req: Request, res: Response) {

        const comment = await this.commentsService.getCommentById(req.params.commentId)
        if (!comment) return res.sendStatus(404)

        //let updateResult = await commentsService.updateLike(req.params.commentId, req.body.likeStatus)
        // updateOne({}, {}, {upsert: true})
        //todo upsert id possible here
        const likeStatusEntity = await this.likesStatusesService.checkExistence(req.user.id, req.params.commentId)
        if (!likeStatusEntity) {
            const creationResult = await this.likesStatusesService.create(req.user.id, req.params.commentId, req.body.likeStatus)
            if (!creationResult) return res.sendStatus(400)
            return res.sendStatus(204)
        } else {
            const updateResult = await this.likesStatusesService.update(req.user.id, req.params.commentId, req.body.likeStatus)
            if (!updateResult) return res.sendStatus(400)
            return res.sendStatus(204)
        }

    }

    async updateComment(req: Request, res: Response) {
        const comment = await this.commentsService.getCommentById(req.params.commentId)
        if (comment) {
            if (req.user!.id !== comment.commentatorInfo.userId) {
                res.sendStatus(403)
            } else {
                const isUpdated = await this.commentsService.updateComment(req.params.commentId, req.body.content)
                if (isUpdated) {
                    //const comment = await commentsService.getCommentById(req.params.commentId)
                    res.sendStatus(204)
                } else {
                    res.sendStatus(404)
                }
            }
        } else {
            res.sendStatus(404)
        }
    }

    async deleteComment(req: Request, res: Response) {
        const comment = await this.commentsService.getCommentById(req.params.commentId)
        if (comment) {
            if (req.user!.id !== comment.commentatorInfo.userId) {
                res.sendStatus(403)
            } else {
                const isDeleted: boolean = await this.commentsService.delete(req.params.id)
                if (isDeleted) {
                    res.sendStatus(204)
                } else {
                    res.sendStatus(404)
                }
            }
        } else {
            res.sendStatus(404)
        }
    }

    async getComment(req: Request, res: Response) {
        let comment = await this.commentsService.getCommentById(req.params.id)
        if (comment) {
            comment.likesInfo.likesCount = await this.likesStatusesService.likesCount(req.params.id)
            comment.likesInfo.dislikesCount = await this.likesStatusesService.dislikesCount(req.params.id)
            let myStatus = 'None'
            if (req.user) {
                const statusRes = await this.likesStatusesService.getMyStatus(req.user.id, req.params.id)
                if (statusRes) {
                    myStatus = statusRes
                }
            }
            comment.likesInfo.myStatus = myStatus
            return res.status(200).send(comment)
        } else return res.sendStatus(404)
    }

}