import { NextFunction, Request, Response } from 'express'
import { TicketInput } from './types'
import { handleResponse } from '@helpers/errorHandler'
import {
  createTicketService,
  getAllTicketService,
  updateTicketService,
} from './ticket.service'

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)

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
      message: 'Ticket created',
      data: { ...result._doc },
    })
  } catch (error) {
    next(error)
  }
}

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    const data: Partial<TicketInput> = req.body
    const { ticketId } = req.params
    const result = await updateTicketService(data, ticketId)
    return handleResponse({
      res,
      message: 'Ticket Updated',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      offset,
      limit,
      search,
      projectId,
      isforUser,
      startDate,
      endDate,
      status,
      priority,
      userIds,
      orderBy,
      orderType,
      label,
    } = req.query
    // projectID , isforUser , date , priority , status , userIds (latest Data),search
    const strOffset: string = offset ? offset.toString() : '0'
    const strLimit: string = limit ? limit.toString() : '0'
    console.log(req.user)
    const searchText: string = search !== undefined ? search?.toString()! : ''
    const ticketStatus: string = status !== undefined ? status?.toString()! : ''
    const forUser = isforUser !== 'true' ? false : true
    const projectid: string | null =
      projectId !== undefined ? projectId.toString() : null
    const userids = userIds !== undefined ? userIds.toString().split(',') : []
    const stDate: string = startDate !== undefined ? startDate?.toString() : ''
    const enDate: string = endDate
      ? endDate.toString()
      : new Date().toISOString().split('T')[0]
    const strPriority: string =
      priority !== undefined ? priority?.toString() : ''
    const strorderBy: string =
      orderBy !== undefined ? orderBy?.toString()! : 'createdAt'
    const numOrderType: number =
      orderType !== undefined ? Number(orderType)! : -1
    const userId = forUser ? req.user._id : null
    const strLabel: string = label !== undefined ? label?.toString()! : ''
    const listTickets = await getAllTicketService(
      parseInt(strOffset!),
      parseInt(strLimit!),
      searchText,
      projectid,
      userId,
      stDate,
      enDate,
      ticketStatus,
      strPriority,
      userids,
      strorderBy,
      numOrderType,
      strLabel
    )
    return handleResponse({
      res,
      data: { tickets: listTickets },
      message: 'tickets fetched sucess',
    })
  } catch (error) {
    next(error)
  }
}
