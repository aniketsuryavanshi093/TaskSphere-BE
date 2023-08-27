import Ticket from './ticket.model'
import { TicketInput } from './types'

export const createTicketService = async (data: Partial<TicketInput>) => {
  try {
    return await Ticket.create(data)
  } catch (error) {
    throw error
  }
}
