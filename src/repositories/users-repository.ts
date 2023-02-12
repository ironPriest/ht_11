import {UserType} from "../types/types";
import {UserModelClass} from "./db";
import {ObjectId} from "mongodb";


export class UsersRepository {
    async create(newUser: UserType): Promise<UserType> {

        const newUserInstance = new UserModelClass(newUser)

        await newUserInstance.save()

        return newUser
    }
    async newPassword(id: string, passwordHash: string) {

        const userInstance = await UserModelClass.findOne({id})
        if (!userInstance) return false

        userInstance.passwordHash = passwordHash
        await userInstance.save()

        return true
    }
    async findByLoginOrEmail(loginOrEmail: string) {
        return UserModelClass.findOne({ $or: [{email: loginOrEmail}, {login: loginOrEmail}]}).lean()
    }
    async findById(id: ObjectId) {
        return UserModelClass.findOne({_id: id}).lean()
    }
    async findByEmail(email: string): Promise<UserType | null> {
        return UserModelClass.findOne({email: email}).lean()
    }
    async getUsers(
        searchLoginTerm: string | undefined,
        searchEmailTerm: string | undefined,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {
        const loginFilter: any = {}
        const emailFilter: any = {}
        if (searchLoginTerm) {
            loginFilter.login = {$regex: searchLoginTerm, $options: 'i'}
        }
        if (searchEmailTerm) {
            emailFilter.email = {$regex: searchEmailTerm, $options: 'i'}
        }
        let totalCount = await UserModelClass.count({$or:[loginFilter, emailFilter]})
        let pageCount = Math.ceil(+totalCount / pageSize)
        const sortFilter: any = {}
        switch (sortDirection) {
            case ('Asc'): sortFilter[sortBy] = 1
                break
            case ('Desc'): sortFilter[sortBy] = -1
                break
        }

        let query = UserModelClass.
        find({$or:[loginFilter, emailFilter]}).
        select('-_id -passwordHash').
        sort(sortFilter).
        skip((pageNumber - 1) * pageSize).
        limit(pageSize)

        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": await query
        }
    }
    async delete(id: string) {

        const userInstance = await UserModelClass.findOne({id})
        if (!userInstance) return false

        await userInstance.deleteOne()
        return true

    }
    async deleteAll() {
        await UserModelClass.deleteMany()
    }
}