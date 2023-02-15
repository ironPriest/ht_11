import {Router} from "express";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {commentValidation} from "./posts-router";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {userCheckMiddleware} from "../middlewares/user-check-middleware";
import {body} from "express-validator";
import {commentsController} from "../composition-root";

export const commentsRouter = Router({})

const likeValidation = body('likeStatus')
    .exists({checkFalsy: true}).isIn(['None', 'Like', 'Dislike'])

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