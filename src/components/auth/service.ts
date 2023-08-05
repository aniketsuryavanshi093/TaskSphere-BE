import Member from '@members/member.model'
import AppError from '../../utils/appError'
import Organization from '@organization/oragnization.model'

export const createOrganization = async (input: any) => {
  const doc = await Organization.create(input)
  return doc ? doc : null
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
