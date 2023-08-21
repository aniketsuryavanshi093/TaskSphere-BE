// import AppError from '../../utils/appError'
// import { TUser, userInput } from './types'
// import User from './projects.model'

import AppError from '@utils/appError'
import Project from './projects.model'
import { projectTypes } from './types'
import Organization from '@organization/oragnization.model'
import { Schema } from 'mongoose'

export const addProjectService = async (input: projectTypes): Promise<projectTypes> => {
    try {
        const isprojectExists = await Project.findOne({ title: input.title })
        if (isprojectExists) {
            throw new AppError('Project already exists with same title!', 400)
        }
        const doc = await Project.create(input)
        await Organization.findByIdAndUpdate(input.organizationId, {
            $push: {
                projects: doc
            }
        })
        return doc._doc
    } catch (error: any) {
        throw new AppError(error, 400)
    }
}

export const addMembertoProjectService = async (memberId: string, projectId: string): Promise<projectTypes> => {
    try {
        const response = await Project.findByIdAndUpdate(projectId, {
            $addToSet: {
                members: memberId
            }
        }, { upsert: true, new: true })
        return response?._doc
    } catch (error: any) {
        throw new AppError(error, 400)
    }
}

export const getAllusersService = async (projectId: string): Promise<projectTypes> => {
    try {
        const response = await Project.findById(projectId)
            .populate({
                path: 'members',
            })
            .select('members')
        return response?._doc
    } catch (error: any) {
        throw new AppError(error, 400)
    }
}