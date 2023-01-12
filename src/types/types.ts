import {ObjectId, WithId} from 'mongodb'

export class BlogType {
    constructor(
        public _id: ObjectId,
        public id: string,
        public name: string,
        public websiteUrl: string,
        public description: string,
        public createdAt: Date
    ) {
    }
}
export type PostType = WithId<{
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
}>
export type UserType = WithId<{
    id: string
    login: string
    passwordHash: string
    email: string
    createdAt: Date
}>

export class CommentType {
    constructor(
        public _id: ObjectId,
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public createdAt: Date,
        public postId: string,
        public likesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string
        }
    ) {
    }
}
// export type CommentType = WithId<{
//     id: string
//     content: string
//     userId: string
//     userLogin: string
//     createdAt: Date
//     postId: string
// }>
export type EmailConfirmationType = WithId<{
    userId: string
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}>
export type TokenType = WithId<{
    token: string
}>
export type DeviceAuthSessionType = WithId<{
    lastActiveDate: Date
    deviceId: string
    ip: string
    title: string
    userId: ObjectId
    rtExpDate: Date
}>
export type TimeStampType = WithId<{
    route: string
    ip: string
    timeStamp: Date
}>
export type RecoveryCodeType = WithId<{
    email: string
    recoveryCode: string
}>
