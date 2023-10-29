import express from 'express'
// import { userAuth } from '../../middlewares/auth'
import {
  //   forgetPassword,
  //   loginUser,
  //   registerUser,
  //   resetPassword,
  //   updateUser,
  addMember,
  getprojectAllusers,
  getorganizationAllusers,
} from '../members/member.controller'
import { userAuth } from '../../middlewares/auth'

const router = express.Router()
router.post('/addMember', userAuth, addMember)
router.get('/getprojectusers/:project', userAuth, getprojectAllusers)
router.get('/getAllusers/:org', userAuth, getorganizationAllusers)
// router.post('/login', loginUser)
// router.patch('/update', userAuth, updateUser)
// router.post('/forgotPassword', forgetPassword)
// router.post('/resetPassword/:token', resetPassword)

export default router
