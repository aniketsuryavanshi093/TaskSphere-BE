import express from 'express'
import { login, registerOrganization, update } from '@auth/controller'
// import { userAuth } from '../../middlewares/auth'
// import {
//   bookCabByid,
//   cancelBooking,
//   createBooking,
//   dropped,
//   getAllBookings,
//   getdriverbooking,
//   getMyBookings,
//   getNearByCab,
// } from './organization.controller'

const router = express.Router()

router.post('/register', registerOrganization)
router.post('/login', login)
router.post('/update', update)
export default router
