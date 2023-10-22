import express from 'express'
import memberRouter from '@members/member.route'
import organizationRoute from '@organization/oragnization.routes'
import authRoute from '@auth/route'
import projectRoutes from './projects/projects.route'
import ticketRouter from './tickets/ticket.route'

import activityRoute from './activity/route'
// import bookRouter from './booking/bookingRoutes'
const router = express.Router()

router.use('/auth', authRoute)
router.use('/members', memberRouter)
router.use('/organization', organizationRoute)
router.use('/project', projectRoutes)
router.use('/ticket', ticketRouter)
router.use('/activity', activityRoute)

export default router
