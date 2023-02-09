import {Request, Response, Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {body} from "express-validator";
import {usersService} from "../domain/users-service";

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

class UsersController {

    async createUser(req: Request, res: Response) {
        const newUser = await usersService.create(
            req.body.login,
            req.body.password,
            req.body.email)
        return res.status(201).send(newUser)
    }

    async getUsers(req: Request, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc'
        const users = await usersService.getUsers(
            req.query.searchLoginTerm?.toString(),
            req.query.searchEmailTerm?.toString(),
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)
        return res.send(users)
    }

    async deleteUser(req: Request, res: Response) {
        const isDeleted = await usersService.delete(req.params.id)
        if (isDeleted) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    }
}

const usersController = new UsersController()

usersRouter.post(
    '/',
    authMiddleware,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    usersController.createUser
)

usersRouter.get('/', usersController.getUsers)

usersRouter.delete('/:id', authMiddleware, usersController.deleteUser)