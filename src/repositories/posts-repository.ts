import {PostType} from "../types/types";
import {PostModelClass} from "./db";

export class PostsRepository {

    async getPosts(
        blogId: string | null,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {

        let totalCount = await PostModelClass.count()
        let pageCount = Math.ceil(+totalCount / pageSize)
        const sortFilter: any = {}
        switch (sortDirection) {
            case ('Asc'): sortFilter[sortBy] = 1
                break
            case ('Desc'): sortFilter[sortBy] = -1
                break
        }

        let query = PostModelClass.
        find().
        select('-_id').
        sort(sortFilter).
        skip((pageNumber - 1) * pageSize).
        limit(pageSize)

        if (blogId) {
            query = query.find({blogId})
        }

        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": await query
        }
    }

    //todo what better: id vs postId
    async getPostById(postId: string): Promise<PostType | null> {
        return PostModelClass.findOne({id: postId}).lean()
    }

    async createPost(post: PostType): Promise<PostType | null> {

        const newPostInstance = new PostModelClass(post)

        await newPostInstance.save()

        return newPostInstance

    }

    async updatePost(
        postId: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<boolean> {

        const postInstance = await  PostModelClass.findOne({id: postId})
        if (!postInstance) return false

        postInstance.title = title
        postInstance.shortDescription = shortDescription
        postInstance.content = content
        postInstance.blogId = blogId

        await postInstance.save()

        return true
    }

    async deletePost(postId: string): Promise<boolean> {

        const postInstance = await PostModelClass.findOne({id: postId})
        if (!postInstance) return false

        await postInstance.deleteOne()

        return true
    }

    async deleteAll() {
        await PostModelClass.deleteMany()
    }

}