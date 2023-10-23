import { NextFunction } from "express"
import { createBlogService } from "./service"
import { handleResponse } from "@helpers/errorHandler"

export const createBlog = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const _id = req.user._id
        const data = await createBlogService(req.body, _id)
        return handleResponse({
            res,
            data: { ...data._doc },
        })
    } catch (error: any) {
        if (error.isJoi === true) {
            error.statusCode = 422
        }
        next(error)
    }
}
