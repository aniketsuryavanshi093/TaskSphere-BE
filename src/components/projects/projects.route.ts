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
import express from 'express'
import { userAuth } from '@middlewares/auth'
import {
    AddProject,
    addMembertoProject,
    getprojectbyuser,
    getproject
} from './projects.controller'

const router = express.Router()

router.post('/createProject', userAuth, AddProject)
router.post('/addMember/:id/:project', userAuth, addMembertoProject)
router.get('/getprojectsbyuser/:user', userAuth, getprojectbyuser)
router.get('/getprojects/:project', userAuth, getproject)

export default router
