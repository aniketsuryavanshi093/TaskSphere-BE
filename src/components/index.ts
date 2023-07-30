import express from 'express'
import memberRouter from '@members/member.route'
// import cabRouter from './cab/cabRoutes'
// import bookRouter from './booking/bookingRoutes'
const router = express.Router()

router.use('/members', memberRouter)
// router.use('/cab', cabRouter)
// router.use('/booking', bookRouter)
export default router
