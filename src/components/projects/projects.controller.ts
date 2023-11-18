/* eslint-disable prettier/prettier */
import { Request, Response, NextFunction } from 'express'
import AppError from '../../utils/appError'
import { handleResponse } from '../../helpers/errorHandler'
import {
  addMembertoProjectService,
  addProjectService,
  getprojectbyuserService,
  getProjectForAdminService,
  getprojectService,
} from './projects.services'
import { createActivity } from '../activity/service'

export const AddProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // check for role admin
    if (req.user.role !== 'organization') {
      throw new AppError('You are not authorized to access this route', 400)
    }
    const result = await addProjectService({
      ...req.body,
      organizationId: req.user._id,
    })
    if (req?.body?.length) {
      await Promise.all(
        req.body.members.map(async (e) => {
          await createActivity({
            createdByOrg: req.user._id,
            action: 'added',
            type: 'Project',
            assignedTo: e,
            projectId: result._id,
          })
        })
      )
    }
    return handleResponse({
      res,
      data: { ...result },
    })
  } catch (error: any) {
    console.log(error)

    if (error.isJoi === true) {
      error.statusCode = 422
    }
    next(error)
  }
}
export const addMembertoProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    if (req.user.role !== 'organization') {
      throw new AppError('You are not authorized to access this route', 400)
    }
    console.log((req.params.id, req.params.project))
    const result = await addMembertoProjectService(
      req.params.id,
      req.params.project
    )
    await createActivity({
      createdByOrg: req.user._id,
      action: 'added',
      type: 'Project',
      assignedTo: req.params.id,
      projectId: req.params.project,
    })
    return handleResponse({
      res,
      data: { ...result },
    })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.statusCode = 422
    }
    next(error)
  }
}

export const getprojectbyuser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const userId = req.params.user
    const { isAnalytics } = req.query
    const isForAnalytics =
      isAnalytics && isAnalytics.toString() === 'true' ? true : false
    const userprojects = await getprojectbyuserService(userId, isForAnalytics)
    return res.status(200).json({
      status: 'success',
      message: 'Project users details fetch successfully',
      data: isForAnalytics
        ? { data: userprojects }
        : { projects: userprojects },
    })
  } catch (error) {
    next(error)
  }
}

export const getproject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const projectId = req.params.project
    const count = req.query.count
    const project = await getprojectService(projectId, !!count)
    return res.status(200).json({
      status: 'success',
      message: 'Project detail fetch successfully',
      data: { project: project },
    })
  } catch (error) {
    next(error)
  }
}

export const getprojectforAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // if (req.user.role !== 'organization') {
    //   throw new AppError('You are not authorized to access this route', 400)
    // }
    // const userId = req.params.user
    const userprojects = await getProjectForAdminService()
    return res.status(200).json({
      status: 'success',
      message: 'Project users details fetch successfully',
      data: { projects: userprojects },
    })
  } catch (error) {
    next(error)
  }
}
