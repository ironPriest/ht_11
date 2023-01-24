import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {commentValidation} from "./posts-router";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {likesStatusesService} from "../domain/like-statuses-service";
import {userCheckMiddleware} from "../middlewares/user-check-middleware";

export const commentsRouter = Router({})

class CommentsController {
    async updateLike(req: Request, res: Response) {

        const comment = await commentsService.getCommentById(req.params.commentId)
        if (!comment) return res.sendStatus(404)

        //let updateResult = await commentsService.updateLike(req.params.commentId, req.body.likeStatus)
        const likeStatusEntity = await likesStatusesService.checkExistence(req.user.id, req.params.commentId)
        if (!likeStatusEntity) {
            const creationResult = await likesStatusesService.create(req.user.id, req.params.commentId, req.body.likeStatus)
            if (!creationResult) return res.sendStatus(400)

            res.sendStatus(204)
        }

        const updateResult = await likesStatusesService.update(req.user.id, req.params.commentId, req.body.likeStatus)
        if (!updateResult) return res.sendStatus(400)

        res.sendStatus(204)
    }

    async updateComment(req: Request, res: Response) {
        const comment = await commentsService.getCommentById(req.params.commentId)
        if (comment) {
            if (req.user!.id !== comment.userId) {
                res.sendStatus(403)
            } else {
                const isUpdated = await commentsService.updateComment(req.params.commentId, req.body.content)
                if (isUpdated) {
                    const comment = await commentsService.getCommentById(req.params.commentId)
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
        const comment = await commentsService.getCommentById(req.params.commentId)
        if (comment) {
            if (req.user!.id !== comment.userId) {
                res.sendStatus(403)
            } else {
                const isDeleted: boolean = await commentsService.delete(req.params.id)
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
        let comment = await commentsService.getCommentById(req.params.commentId)
        if (comment) {
            console.log('-- comment found --')
            comment.likesInfo.likesCount = await likesStatusesService.likesCount(req.params.commentId)
            comment.likesInfo.dislikesCount = await likesStatusesService.dislikesCount(req.params.commentId)
            console.log('likesInfo -->', comment.likesInfo)
            //if req.userId -> get likes by commentId and userId
            //else myStatus = none
            let myStatus: string
            if (req.user) {
                const statusRes = await likesStatusesService.getMyStatus(req.user.id, req.params.commentId)
                console.log('statusRes --> ', statusRes)
                if (!statusRes) return res.sendStatus(404)
                myStatus = statusRes
            } else {
                myStatus = 'None'
            }

            //const myStatus = await likesStatusesService.getMyStatus(req.user.id, req.params.commentId)
            //if(!myStatus) return res.sendStatus(404)
            comment.likesInfo.myStatus = myStatus
            // if (!req.headers.authorization) {
            //     comment.likesInfo.myStatus = 'None'
            //     return res.status(200).send(comment)
            // }
            return res.status(200).send(comment)
        } else {
            return res.sendStatus(404)
        }
    }
}

const commentsController = new CommentsController()

commentsRouter
    .put(
        '/:commentId/like-status',
        bearerAuthMiddleware,
        commentsController.updateLike
    )
    .put(
        '/:commentId',
        bearerAuthMiddleware,
        commentValidation,
        inputValidationMiddleware,
        commentsController.updateComment
    )
    .delete(
        '/:commentId',
        bearerAuthMiddleware,
        commentsController.deleteComment
    )
    .get(
        '/:commentId',
        userCheckMiddleware,
        commentsController.getComment
    )