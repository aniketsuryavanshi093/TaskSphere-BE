import AppError from "@utils/appError"
import Blog from "./blogmodel"

export const createBlogService = async (body, userId) => {
    try {
        const rs = await Blog.create({ ...body, author: userId })
        return rs
    } catch (error) {
        throw new AppError(error, 400)
    }
}