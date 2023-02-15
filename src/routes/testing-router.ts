import {Router} from "express";
import {testingController} from "../composition-root";

export const testingRouter = Router({})

testingRouter.delete(
    '/all-data',
    testingController.delete.bind(testingController)
)