import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {commentValidation} from "./posts-router";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const commentsRouter = Router({})

class CommentsController {
    async updateLike(req: Request, res: Response) {

        const comment = await commentsService.getCommentById(req.params.commentId)
        if (!comment) return res.sendStatus(404)

        let updateResult = await commentsService.updateLike(req.params.commentId, req.body.likeStatus)
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
        const comment = await commentsService.getCommentById(req.params.commentId)
        if (comment) {
            res.status(200).send(comment)
        } else {
            res.sendStatus(404)
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
        commentsController.getComment
    )