import express from 'express'
import memberRouter from '@members/member.route'
import organizationRoute from '@organization/oragnization.routes'
import authRoute from '@auth/route'
// import cabRouter from './cab/cabRoutes'
// import bookRouter from './booking/bookingRoutes'
const router = express.Router()

router.use('/auth', authRoute)
router.use('/members', memberRouter)
router.use('/organization', organizationRoute)
// router.use('/booking', bookRouter)
export default router
