import {ObjectId} from "mongodb";
import {UsersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {v4} from "uuid";
import {UserType} from "../types/types";

export class UsersService {

    private usersRepository: any;
    constructor() {
        this.usersRepository = new UsersRepository()
    }

    async create(
        login: string,
        password: string,
        email: string) {
        const passwordHash = await authService._generateHash(password)
        let user = new UserType(
            new ObjectId(),
            v4(),
            login,
            passwordHash,
            email,
            new Date()
        )
        let res = await this.usersRepository.create(user)
        if(!res){
            return
        }
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }

    async findById(userId: any) {
        let user = await this.usersRepository.findById(userId)
        if (user) {
            return user
        } else {
            return null
        }
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        let user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (user) {
            return user
        } else {
            return null
        }
    }

    async findByEmail(email: string) {
        let user = await this.usersRepository.findByEmail(email)
        if (user) {
            return user
        } else {
            return null
        }
    }

    async getUsers(
        searchLoginTerm: string | undefined,
        searchEmailTerm: string | undefined,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {
        return await this.usersRepository.getUsers(
            searchLoginTerm,
            searchEmailTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)
    }

    async delete(id: string) {
        return this.usersRepository.delete(id)
    }

}