/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Request, Response } from 'express'
import { TicketInput, comment } from './types'
import { handleResponse } from '../../helpers/errorHandler'
import {
  addReplytocommentService,
  createTicketService,
  getAllTicketService,
  getPaginatedCommentsService,
  updateTicketService,
  createCommentService,
  searchTicketService,
} from './ticket.service'
import { createActivity } from '../activity/service'

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Partial<TicketInput> = req.body
    const result: any = await createTicketService({
      ...data,
      createdBy: req.user.role === 'member' ? req.user._id : null,
      createdByOrg: req.user.role === 'organization' ? req.user._id : null,
    })
    await createActivity({
      createdBy: req.user.role === 'member' ? req.user._id : null,
      createdByOrg: req.user.role === 'organization' ? req.user._id : null,
      action: 'create',
      type: 'Ticket',
      assignedTo: result.assignedTo,
      projectId: result.projectId,
      ticketId: result._id,
    })
    await createActivity({
      createdBy: req.user.role === 'member' ? req.user._id : null,
      createdByOrg: req.user.role === 'organization' ? req.user._id : null,
      action: 'assign',
      type: 'Ticket',
      assignedTo: result.assignedTo,
      projectId: result.projectId,
      ticketId: result._id,
    })
    return handleResponse({
      res,
      message: 'Ticket created',
      data: { ...result._doc },
    })
  } catch (error) {
    next(error)
  }
}

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ticketId } = req.params
    const { pageNumber, pageSize } = req.query as {
      pageNumber: string
      pageSize: string
    }
    const result = await getPaginatedCommentsService(
      ticketId,
      parseInt(pageNumber),
      parseInt(pageSize!)
    )
    return handleResponse({
      res,
      message: 'Comments fetched',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const addReplytocomment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Partial<comment> = req.body
    const { ticketId, commentId } = req.params
    const result = await addReplytocommentService(data, ticketId, commentId)
    return handleResponse({
      res,
      message: 'comment replied successfully',
      data: result,
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
    const data: Partial<TicketInput> = req.body
    const { ticketId } = req.params

    await createActivity({
      createdBy: req.user.role === 'member' ? req.user._id : null,
      createdByOrg: req.user.role === 'organization' ? req.user._id : null,
      action: 'update',
      type: 'Ticket',
      ticketUpdatetext:
        req?.body?.ticketDatachanged ||
        `from ${req.body.currentstatus} to ${req.body.status}`,
      projectId: req.body.projectId,
      ticketId,
    })
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

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: any = req.body
    const { ticketId } = req.params
    const result = await createCommentService(data, ticketId)
    return handleResponse({
      res,
      message: 'Comment created',
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
      notshowDone,
      orderType,
      label,
    } = req.query
    // projectID , isforUser , date , priority , status , userIds (latest Data),search
    const strOffset: string = offset ? offset.toString() : '0'
    const strLimit: string = limit ? limit.toString() : '0'
    const searchText: string = search !== undefined ? search?.toString() : ''
    const ticketStatus: string = status !== undefined ? status?.toString() : ''
    const forUser = isforUser !== 'true' ? false : true
    const _notshowDone = notshowDone === 'true' ? true : false
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
      orderBy !== undefined ? orderBy?.toString() : 'createdAt'
    const numOrderType: number =
      orderType !== undefined ? Number(orderType)! : -1
    const userId = forUser ? req.user._id : null
    const strLabel: string = label !== undefined ? label?.toString() : ''
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
      strLabel,
      _notshowDone,
      req.user.role !== 'organization' ? false : true,
      req.user._id
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
