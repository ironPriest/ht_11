import {TimeStampModelClass} from "./db";
import {TimeStampType} from "../types/types";
import {sub} from "date-fns";

export class TimeStampsRepository {

    async add(newTimeStamp: TimeStampType): Promise<boolean> {

        const newTimeStampInstance = new TimeStampModelClass(newTimeStamp)

        await newTimeStampInstance.save()

        return true

    }

    async getTimeStampsQuantity(route: string, ip: string): Promise<number> {

        return TimeStampModelClass.countDocuments({route, ip})

    }

    async cleanStamps(route: string, ip: string, timeStamp: Date) {

        await TimeStampModelClass.deleteMany({route, ip, timeStamp: {$lt: sub(timeStamp, {seconds: 10})}})

        //todo --> how to implement with mongoose

        // await TimeStampModelClass.
        //     deleteMany({route, ip}).
        //     where('timeStamp').lt(sub(timeStamp, {seconds: 10}))
    }

    async deleteAll() {

        await TimeStampModelClass.deleteMany()

    }

}