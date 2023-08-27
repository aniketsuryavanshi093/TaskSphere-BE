import { NextFunction, Request, Response } from 'express'
import { TicketInput } from './types'
import { handleResponse } from '@helpers/errorHandler'
import { createTicketService } from './ticket.service'
import AppError from '@utils/appError'

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Partial<TicketInput> = req.body

    if (req.user.role === 'organization') {
      data.createdByOrg = req.user._id
    } else {
      data.createdBy = req.user._id
    }
    data.updatedBy = req.user._id

    const result = await createTicketService(data)
    return handleResponse({
      res,
      msg: 'Ticket created',
      data: { ...result._doc },
    })
  } catch (error) {
    next(error)
  }
}
