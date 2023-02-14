import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./routes/blogs-controller";

const blogsRepository = new BlogsRepository()
const blogsService = new BlogsService(blogsRepository)

export const blogsController = new BlogsController(blogsService)