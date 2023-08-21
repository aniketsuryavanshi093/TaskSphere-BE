// import express from 'express'
// import { userAuth } from '../../middlewares/auth'
// import {
//   forgetPassword,
//   loginUser,
//   registerUser,
//   resetPassword,
//   updateUser,
// } from './projects.controller'

// const router = express.Router()

// router.post('/register', registerUser)
// router.post('/login', loginUser)
// router.patch('/update', userAuth, updateUser)
// router.post('/forgotPassword', forgetPassword)
// router.post('/resetPassword/:token', resetPassword)

// export default router
import express from 'express'
import { userAuth } from '@middlewares/auth'
import { AddProject, addMembertoProject, getAllusers } from './projects.controller'
const router = express.Router()

router.post('/createProject', userAuth, AddProject)
router.get('/getAllusers/:org', userAuth, getAllusers)
router.post('/addMember/:id/:org', userAuth, addMembertoProject)
// router.post('/forgotPassword', forgetPassword)
// router.post('/resetPassword/:token', resetPassword)

export default router
