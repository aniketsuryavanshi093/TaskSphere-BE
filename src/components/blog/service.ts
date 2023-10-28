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

export const getAllblogsService = async (page: number, limit: number) => {
    try {
        const pipeline = [
            {
                $match: {},
            },
        ]
        const skip = (page - 1) * limit
        if (page > 0) {
            pipeline.push({
                $skip: skip,
            })
        }
        if (limit > 0) {
            pipeline.push({
                $limit: limit,
            })
        }
        const [total, blogs] = await Promise.all([
            Blog.countDocuments({}),
            Blog.aggregate(pipeline),
        ])
        return {
            blogs,
            total,
            totalPages: Math.ceil(total / limit),
            currentpage: page,
        }
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
