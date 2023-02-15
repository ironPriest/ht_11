import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {body} from "express-validator";
import {usersController} from "../composition-root";

export const usersRouter = Router({})

const loginValidation = body('login')
    .exists()
    .isString()
    .trim()
    .isLength({min: 3})
    .isLength({max: 10})

const passwordValidation = body('password')
    .exists()
    .isString()
    .trim()
    .isLength({min: 6})
    .isLength({max: 20})

const emailValidation = body('email')
    .trim()
    .exists({checkFalsy: true})
    .isString()
    //.matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

usersRouter.post(
    '/',
    authMiddleware,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    usersController.createUser.bind(usersController)
)

usersRouter.get(
    '/',
    usersController.getUsers.bind(usersController)
)

usersRouter.delete(
    '/:id',
    authMiddleware,
    usersController.deleteUser.bind(usersController)
)