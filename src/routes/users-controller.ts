import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";

export class UsersController {

    constructor(
        protected usersService: UsersService
    ) {
    }

    async createUser(req: Request, res: Response) {
        const newUser = await this.usersService.create(
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
        const users = await this.usersService.getUsers(
            req.query.searchLoginTerm?.toString(),
            req.query.searchEmailTerm?.toString(),
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)
        return res.send(users)
    }

    async deleteUser(req: Request, res: Response) {
        const isDeleted = await this.usersService.delete(req.params.id)
        if (isDeleted) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    }
}