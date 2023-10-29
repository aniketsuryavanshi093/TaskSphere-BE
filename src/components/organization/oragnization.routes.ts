import express from 'express'
import {
  getOrganizationDetails,
  getAllorganizationsProject,
} from './organization.controller'
import { userAuth } from '../../middlewares/auth'
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
router.get('/', userAuth, getOrganizationDetails)
router.get('/getAllProject/:orgId', userAuth, getAllorganizationsProject)
// router.post('/:cabId', userAuth, bookCabByid)
// router.get('/', userAuth, getAllBookings)
// router.get('/history', userAuth, getMyBookings)
// router.get('/driver', userAuth, getdriverbooking)
// router.get('/nearbycab', userAuth, getNearByCab)
// router.delete('/:id', userAuth, cancelBooking)
// router.delete('/complete/:id', userAuth, dropped)

export default router
