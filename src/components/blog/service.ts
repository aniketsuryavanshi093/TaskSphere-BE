import AppError from '@utils/appError'
import Blog from './blogmodel'

export const createBlogService = async (body, userId) => {
    try {
        const rs = await Blog.create({ ...body, author: userId })
        return rs
    } catch (error) {
        throw new AppError(error, 400)
    }
}

export const getAllblogsService = async () => {
    try {
        const rs = await Blog.find()
        return rs
    } catch (error) {
        throw new AppError(error, 400)
    }
}

export const getAblogService = async (slug: string) => {
    try {
        const rs = await Blog.findOne({ slug }).populate({
            path: 'author',
            select: 'name userName profilePic',
        })
        return rs._doc
    } catch (error) {
        throw new AppError(error, 400)
    }
}
