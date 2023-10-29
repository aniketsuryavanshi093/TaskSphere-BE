import Member from '../members/member.model'
import AppError from '../../utils/appError'
import Organization from '../organization/oragnization.model'

export const createOrganization = async (input: any) => {
  try {
    const doc = await Organization.create(input)
    return doc ? doc : null
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const getOrganization = async (filter: any) => {
  try {
    filter.isDeleted = false
    const doc = await Organization.findOne(filter)
    return doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const getMemeber = async (filter: any) => {
  try {
    filter.isDeleted = false
    const doc = await Member.findOne(filter)
    return doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const updateMember = async (filter, userId) => {
  try {
    const doc = await Member.findByIdAndUpdate(userId, filter, {
      new: true,
      upsert: true,
    })
    return doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const updateOrganization = async (filter, userId) => {
  try {
    const doc = await Organization.findByIdAndUpdate(userId, filter, {
      new: true,
      upsert: true,
    })
    return doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}
