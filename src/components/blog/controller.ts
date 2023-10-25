import { NextFunction } from 'express'
import { createBlogService, getAblogService, getAllblogsService } from './service'
import { handleResponse } from '@helpers/errorHandler'

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

export const getAllblogs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const data = await getAllblogsService()
        return handleResponse({
            res,
            data,
        })
    } catch (error: any) {
        if (error.isJoi === true) {
            error.statusCode = 422
        }
        next(error)
    }
}

export const getBlog = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { slug } = req.params
        const data = await getAblogService(slug)
        return handleResponse({
            res,
            data,
        })
    } catch (error: any) {
        if (error.isJoi === true) {
            error.statusCode = 422
        }
        next(error)
    }
}
