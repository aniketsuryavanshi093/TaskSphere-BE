import AppError from '../../utils/appError'
import Blog from './blogmodel'
import { PipelineStage } from 'mongoose'

export const createBlogService = async (body, userId) => {
  try {
    const rs = await Blog.create({ ...body, author: userId })
    return rs
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const getAllblogsService = async (page: number, limit: number) => {
  try {
    const pipeline: PipelineStage[] = [
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
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const searchBlogsService = async (
    searchtext: string,
    isFulsearch: boolean,
    page: number
) => {
    const searchlimit = !isFulsearch ? 4 : 4
    try {
        const pipeline = [
            {
                $match: { $text: { $search: searchtext } },
            },
            {
                $sort: { score: { $meta: 'textScore' } },
            },
        ]
        if (!isFulsearch) {
            pipeline.push({
                $project: {
                    title: 1, // 1 means include this field, 0 means exclude
                    slug: 1, // 1 means include this field, 0 means exclude
                    previewImage: 1, // 1 means include this field, 0 means exclude
                }
            })
        }
        const skip = (page - 1) * searchlimit
        if (page > 0 && isFulsearch) {
            pipeline.push({
                $skip: skip,
            })
        }
        if (searchlimit > 0) {
            pipeline.push({
                $limit: searchlimit,
            })
        }
        if (isFulsearch) {
            const [total, blogs] = await Promise.all([
                Blog.countDocuments({ $text: { $search: searchtext } }),
                Blog.aggregate(pipeline),
            ])
            return { blogs, total, totalPages: Math.ceil(total / searchlimit) }
        } else {
            const [blogs] = await Promise.all([Blog.aggregate(pipeline)])
            return { blogs }
        }
    } catch (error) {
        throw new AppError(error, 400)
    }
}

export const getAblogService = async (slug: string) => {
  try {
    const rs: any = await Blog.findOne({ slug }).populate({
      path: 'author',
      select: 'name userName profilePic',
    })
    return rs._doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}
