import express from 'express'
import { userAuth } from '@middlewares/auth'
import { createTicket, getAllTicket, updateTicket } from './ticket.cotroller'
import { checkIsTicketAdministrator } from '@middlewares/checkIsTicketAdministrator'
const router = express.Router()

// router.use(userAuth)
router.post('/create', checkIsTicketAdministrator, createTicket)
router.post('/updateTicket/:ticketId', checkIsTicketAdministrator, updateTicket)
router.get('/allTickets', getAllTicket)

export default router
