import logger from '@config/logger'
import { handleResponse } from '@helpers/errorHandler'
import { NextFunction, Request, Response } from 'express'
import { getAllActivityService } from './service'

export const getAllActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('inside get all activity controller')
  try {
    const {
      offset,
      limit,
      projectId,
      startDate,
      endDate,
      action,
      type,
      orderBy,
      orderType,
    } = req.query

    const strOffset: string = offset ? offset.toString() : '0'
    const strLimit: string = limit ? limit.toString() : '0'

    const strAction: string = action !== undefined ? action?.toString()! : ''

    const projectid: string | null =
      projectId !== undefined ? projectId.toString() : null

    const stDate: string = startDate !== undefined ? startDate?.toString() : ''
    const enDate: string = endDate
      ? endDate.toString()
      : new Date().toISOString().split('T')[0]
    const strType: string = type !== undefined ? type?.toString() : ''
    const strorderBy: string =
      orderBy !== undefined ? orderBy?.toString()! : 'createdAt'
    const numOrderType: number =
      orderType !== undefined ? Number(orderType)! : -1

    const activities = await getAllActivityService(
      req.user._id,
      parseInt(strOffset!),
      parseInt(strLimit!),
      projectid,
      stDate,
      enDate,
      strType,
      strAction,
      strorderBy,
      numOrderType,
      req.user.role !== 'organization' ? false : true
    )
    return handleResponse({
      res,
      data: { activities },
      message: 'Activity fetched success',
    })
  } catch (error) {
    next(error)
  }
}
