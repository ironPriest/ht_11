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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
const users_router_1 = require("./routes/users-router");
const auth_router_1 = require("./routes/auth-router");
const comments_router_1 = require("./routes/comments-router");
const testing_router_1 = require("./routes/testing-router");
const security_devices_router_1 = require("./routes/security-devices-router");
const db_1 = require("./repositories/db");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.set('trust proxy', true);
const parserMiddleware = express_1.default.json();
app.use(parserMiddleware);
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send(':0');
});
app.use('/blogs', blogs_router_1.blogsRouter);
app.use('/posts', posts_router_1.postsRouter);
app.use('/users', users_router_1.usersRouter);
app.use('/auth', auth_router_1.authRouter);
app.use('/comments', comments_router_1.commentsRouter);
app.use('/testing', testing_router_1.testingRouter);
app.use('/security/devices', security_devices_router_1.securityDevicesRouter);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
