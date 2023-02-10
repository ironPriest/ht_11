import {ObjectId} from 'mongodb'

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
        public createdAt: string
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

export class DeviceAuthSessionType {
    constructor(
        public _id: ObjectId,
        public lastActiveDate: string,
        public deviceId: string,
        public ip: string,
        public title: string,
        public userId: ObjectId,
        public rtExpDate: Date
    ) {
    }
}

export class TimeStampType {
    constructor(
        public _id: ObjectId,
        public route: string,
        public ip: string,
        public timeStamp: Date
    ) {
    }
}

export class RecoveryCodeType {
    constructor(
        public _id: ObjectId,
        public email: string,
        public recoveryCode: string
    ) {
    }
}

export class LikeStatus {
    constructor(
        public _id: ObjectId,
        public userId: string,
        public commentId: string,
        public likeStatus: string
    ) {
    }
}
