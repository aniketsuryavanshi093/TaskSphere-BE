import logger from '@config/logger'
import { ActivityInterface } from './type'
import Activity from './model'

export const createActivity = async (payload: Partial<ActivityInterface>) => {
  logger.info('inside get activity service')
  try {
    const data = await Activity.create(payload)
    return data
  } catch (error) {
    throw error
  }
}
