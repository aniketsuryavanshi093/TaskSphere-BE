import express from 'express'
import { userAuth } from '@middlewares/auth'
import { createTicket } from './ticket.cotroller'
import { checkIsTicketAdministrator } from '@middlewares/checkIsTicketAdministrator'
const router = express.Router()

router.use(userAuth)
router.post('/create', checkIsTicketAdministrator, createTicket)

export default router
