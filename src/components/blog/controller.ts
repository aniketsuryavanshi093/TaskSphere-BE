import { NextFunction, Request, Response } from 'express'
import {
  createBlogService,
  getAblogService,
  getAllblogsService,
  getAllusersBlogService,
  searchBlogsService,
  updateblogService,
} from './service'
import { handleResponse } from '../../helpers/errorHandler'
import { bloginterface } from './type'

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const _id = req.user._id
    const data: any = await createBlogService(req.body, _id)
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
    const { page, limit } = req.query as { page: string; limit: string }
    const data = await getAllblogsService(parseInt(page), parseInt(limit))
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

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const _id = req.user._id
    const { id } = req.params
    const data = await updateblogService(id, req.body as bloginterface, _id)
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
export const getAllusersBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { userid } = req.params
    const data = await getAllusersBlogService(userid)
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

export const searchBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { search, isFulsearch, page } = req.query
    const searchText = search ? search.toString() : ''
    const numpage = page ? page.toString() : '1'
    const data = await searchBlogsService(
      searchText,
      !!isFulsearch,
      parseInt(numpage)
    )
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
