import {Request, Response, Router} from "express";
import {CommentsService} from "../domain/comments-service";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {commentValidation} from "./posts-router";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {likesStatusesService} from "../domain/like-statuses-service";
import {userCheckMiddleware} from "../middlewares/user-check-middleware";
import {body} from "express-validator";

export const commentsRouter = Router({})

const likeValidation = body('likeStatus')
    .exists({checkFalsy: true}).isIn(['None', 'Like', 'Dislike'])

class CommentsController {

    private commentsService: CommentsService;
    constructor() {
        this.commentsService = new CommentsService()
    }

    async updateLike(req: Request, res: Response) {

        const comment = await this.commentsService.getCommentById(req.params.commentId)
        if (!comment) return res.sendStatus(404)

        //let updateResult = await commentsService.updateLike(req.params.commentId, req.body.likeStatus)
        // updateOne({}, {}, {upsert: true})
        //todo upsert id possible here
        const likeStatusEntity = await likesStatusesService.checkExistence(req.user.id, req.params.commentId)
        if (!likeStatusEntity) {
            const creationResult = await likesStatusesService.create(req.user.id, req.params.commentId, req.body.likeStatus)
            if (!creationResult) return res.sendStatus(400)
            return res.sendStatus(204)
        } else {
            const updateResult = await likesStatusesService.update(req.user.id, req.params.commentId, req.body.likeStatus)
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
            comment.likesInfo.likesCount = await likesStatusesService.likesCount(req.params.id)
            comment.likesInfo.dislikesCount = await likesStatusesService.dislikesCount(req.params.id)
            let myStatus = 'None'
            if (req.user) {
                const statusRes = await likesStatusesService.getMyStatus(req.user.id, req.params.id)
                if (statusRes) {
                    myStatus = statusRes
                }
            }
            comment.likesInfo.myStatus = myStatus
            return res.status(200).send(comment)
        } else return res.sendStatus(404)
    }

}

const commentsController = new CommentsController()

commentsRouter
    .put(
        '/:commentId/like-status',
        bearerAuthMiddleware,
        likeValidation,
        inputValidationMiddleware,
        commentsController.updateLike.bind(commentsController)
    )
    .put(
        '/:commentId',
        bearerAuthMiddleware,
        commentValidation,
        inputValidationMiddleware,
        commentsController.updateComment.bind(commentsController)
    )
    .delete(
        '/:commentId',
        bearerAuthMiddleware,
        commentsController.deleteComment.bind(commentsController)
    )
    .get(
        '/:id',
        userCheckMiddleware,
        commentsController.getComment.bind(commentsController)
    )