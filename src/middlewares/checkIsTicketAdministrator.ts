import logger from '@config/logger'
import { getMemeber } from '@members/member.service'
import { getProjectService } from '@projects/projects.services'
import AppError from '@utils/appError'
import { NextFunction, Request, Response } from 'express'

export const checkIsTicketAdministrator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('inside check is administrator middleware')
  try {
    const { projectId } = req.body
    const { role, _id } = req.user
    if (role === 'organization') {
      const project = await getProjectService({
        _id: projectId,
        organizationId: _id,
      })
      if (project === null) {
        next(new AppError('Project not found', 409))
      }

      return next()
    }
    const project = await getProjectService({
      _id: projectId,
      members: { $in: [_id] },
    })
    if (project === null) {
      next(new AppError('Project not found', 409))
    }

    if (!project?.members[0].ticketAdministrator) {
      throw new AppError('You are not authorized!', 401)
    }

    return next()
  } catch (error) {
    next(error)
  }
}
