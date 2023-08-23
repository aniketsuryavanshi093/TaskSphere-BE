/* eslint-disable prettier/prettier */
import { Request, Response, NextFunction } from 'express'
import AppError from '@utils/appError'
import { handleResponse } from '@helpers/errorHandler'
import { addMembertoProjectService, addProjectService, } from './projects.services'

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
        const result = await addProjectService({ ...req.body, organizationId: req.user._id })
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
export const addMembertoProject = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        // check for role if there is organization and ticketadminitrator true
        // if (req.user.role !== 'organization') {
        //     throw new AppError('You are not authorized to access this route', 400)
        // }
        const result = await addMembertoProjectService(req.params.id, req.params.org)
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

