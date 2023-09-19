import express from 'express'
import { userAuth } from '@middlewares/auth'
import {
    createTicket,
    getAllTicket,
    updateTicket,
    createComment,
    getComments,
    addReplytocomment,
} from './ticket.cotroller'
import { checkIsTicketAdministrator } from '@middlewares/checkIsTicketAdministrator'
const router = express.Router()
router.use(userAuth)

router.post('/create', checkIsTicketAdministrator, createTicket)
router.post('/updateTicket/:ticketId', checkIsTicketAdministrator, updateTicket)
router.get('/allTickets', getAllTicket)
// comments
router.post('/comments/:ticketId', createComment)
router.get('/comments/:ticketId', getComments)
router.post('/reply/:ticketId/:commentId', addReplytocomment)

export default router
