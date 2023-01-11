import {TimeStampModelClass} from "./db";
import {BlogType, TimeStampType} from "../types/types";
import {sub} from "date-fns";

export const timeStampsRepository = {
    async add(newTimeStamp: TimeStampType): Promise<boolean> {
        //await TimeStampModelClass.insertOne(timeStamp)

        const newTimeStampInstance = new TimeStampModelClass()
        newTimeStampInstance._id = newTimeStamp._id
        newTimeStampInstance.route = newTimeStamp.route
        newTimeStampInstance.ip = newTimeStamp.ip
        newTimeStampInstance.timeStamp = newTimeStamp.timeStamp

        await newTimeStampInstance.save()

        return true
    },
    async getTimeStampsQuantity(route: string, ip: string): Promise<number> {
        return TimeStampModelClass.countDocuments({route, ip})
    },
    async cleanStamps(route: string, ip: string, timeStamp: Date) {
        await TimeStampModelClass.deleteMany({route, ip, timeStamp: {$lt: sub(timeStamp, {seconds: 10})}})

        //todo --> how to implement with mongoose

        // await TimeStampModelClass.
        //     deleteMany({route, ip}).
        //     where('timeStamp').lt(sub(timeStamp, {seconds: 10}))
    },
    async deleteAll() {
        await TimeStampModelClass.deleteMany()
    }
}