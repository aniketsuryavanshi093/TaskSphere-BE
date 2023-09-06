import express from 'express'
import { userAuth } from '@middlewares/auth'
import { createTicket, getAllTicket } from './ticket.cotroller'
import { checkIsTicketAdministrator } from '@middlewares/checkIsTicketAdministrator'
const router = express.Router()

router.use(userAuth)
router.post('/create', checkIsTicketAdministrator, createTicket)
router.get('/allTickets', getAllTicket)

export default router
