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

export class PostType {
    constructor(
        public _id: ObjectId,
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: Date
    ) {
    }
}

export class UserType {
    constructor(
        public _id: ObjectId,
        public id: string,
        public login: string,
        public passwordHash: string,
        public email: string,
        public createdAt: Date
    ) {
    }
}

export class CommentType {
    constructor(
        public _id: ObjectId,
        public id: string,
        public content: string,
        public commentatorInfo: {
            userId: string,
            userLogin: string
        },
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

export class EmailConfirmationType {
    constructor(
        public _id: ObjectId,
        public userId: string,
        public confirmationCode: string,
        public expirationDate: Date,
        public isConfirmed: boolean
    ) {
    }
}

export class TokenType {
    constructor(
        public _id: ObjectId,
        public token: string
    ) {
    }
}

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
export class LikeStatus {
    constructor(
        public _id: ObjectId,
        public userId: string,
        public commentId: string,
        public likeStatus: string
    ) {
    }
}
