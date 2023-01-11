"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.RecoveryCodeModelClass = exports.TimeStampModelClass = exports.DeviceAuthSessionModelClass = exports.BlackTokenModelClass = exports.EmailConfirmationModelClass = exports.CommentModelClass = exports.UserModelClass = exports.PostModelClass = exports.BlogModelClass = exports.client = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
const mongoForMongooseUri = process.env.mongoForMongooseURI || "mongodb://0.0.0.0:27017/testDB";
exports.client = new mongodb_1.MongoClient(mongoUri);
let dbName = "testDB";
let db = exports.client.db(dbName);
//export const RecoveryCodeModelClass = db.collection<RecoveryCodeType>('recoveryCodes')
const BlogSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: true }
}
//todo instance method for case insensitive regex query
/*,
    {methods: {
        caseInsRegexQuery(searchTerm) {
            return mongoose.model('blogs').find({name: {$regex: searchTerm, $options: 'i'}})
        }
    }
}*/ );
exports.BlogModelClass = mongoose_1.default.model('blogs', BlogSchema);
const PostSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
});
exports.PostModelClass = mongoose_1.default.model('posts', PostSchema);
const UserSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    login: { type: String, required: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true }
});
exports.UserModelClass = mongoose_1.default.model('users', UserSchema);
const CommentSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
    createdAt: { type: Date, required: true },
    postId: { type: String, required: true }
});
exports.CommentModelClass = mongoose_1.default.model('comments', CommentSchema);
const EmailConfirmationSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true }
});
exports.EmailConfirmationModelClass = mongoose_1.default.model('emailConfirmations', EmailConfirmationSchema);
const BlackTokenSchema = new mongoose_1.default.Schema({
    token: { type: String, required: true }
});
exports.BlackTokenModelClass = mongoose_1.default.model('blackTokens', BlackTokenSchema);
const DeviceAuthSessionSchema = new mongoose_1.default.Schema({
    lastActiveDate: { type: Date, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true },
    userId: { type: mongodb_1.ObjectId, required: true },
    rtExpDate: { type: Date, required: true }
});
exports.DeviceAuthSessionModelClass = mongoose_1.default.model('deviceAuthSessions', DeviceAuthSessionSchema);
const TimeStampSchema = new mongoose_1.default.Schema({
    route: { type: String, required: true },
    ip: { type: String, required: true },
    timeStamp: { type: Date, required: true }
});
exports.TimeStampModelClass = mongoose_1.default.model('timeStamps', TimeStampSchema);
const RecoveryCodeSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    recoveryCode: { type: String, required: true }
});
exports.RecoveryCodeModelClass = mongoose_1.default.model('recoveryCodes', RecoveryCodeSchema);
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client to the server
            yield exports.client.connect();
            yield mongoose_1.default.connect(mongoForMongooseUri);
            console.log("Connected successfully to mongo server");
        }
        catch (_a) {
            console.log("Can't connect to db");
            // Ensures that the client will close when you finish/error
            yield exports.client.close();
            yield mongoose_1.default.disconnect();
        }
    });
}
exports.runDb = runDb;
