import {PostType, BlogType} from "../types/types";
import {BlogModelClass, PostModelClass} from "./db";
import {ObjectId} from "mongodb";
import {v4} from "uuid";

export const postsRepository = {
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
    },
    //todo what better: id vs postId
    async getPostById(postId: string): Promise<PostType | null> {
        return PostModelClass.findOne({id: postId}).lean()
    },
    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<PostType | null> {

            let blogInstance = await BlogModelClass.findOne({id: blogId})
            if (!blogInstance) return null

            // let newPost: PostType
            // await PostModelClass.create( newPost = {
            //         _id: new ObjectId(),
            //         id: v4(),
            //         title: title,
            //         shortDescription: shortDescription,
            //         content: content,
            //         blogId: blogId,
            //         bloggerName: blogger?.name,
            //         createdAt: new Date()
            // })

            const newPostInstance = new PostModelClass()
            newPostInstance._id = new ObjectId()
            newPostInstance.id = v4()
            newPostInstance.title = title
            newPostInstance.shortDescription = shortDescription
            newPostInstance.content = content
            newPostInstance.blogId = blogId
            newPostInstance.blogName = blogInstance.name
            newPostInstance.createdAt = new Date()

            await newPostInstance.save()

            return newPostInstance
        },
    async updatePost(
        postId: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<boolean> {

        const postInstance = await  PostModelClass.findOne({id: postId})
        if (!postInstance) return false

        // await PostModelClass.updateOne({id: postId}, {$set: {
        //     title: title,
        //         shortDescription: shortDescription,
        //         content: content,
        //         bloggerId: blogId
        // }})

        postInstance.title = title
        postInstance.shortDescription = shortDescription
        postInstance.content = content
        postInstance.blogId = blogId

        await postInstance.save()

        return true
    },
    async deletePost(postId: string): Promise<boolean> {
        // let result = await PostModelClass.deleteOne({id: postId})
        // return result.deletedCount === 1

        const postInstance = await PostModelClass.findOne({id: postId})
        if (!postInstance) return false

        await postInstance.deleteOne()

        return true
    },
    async deleteAll() {
        await PostModelClass.deleteMany()
    }
}