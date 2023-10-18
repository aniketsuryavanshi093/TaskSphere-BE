import express from 'express'
import { login, registerOrganization, update, isExist } from '@auth/controller'
import { userAuth } from '@middlewares/auth'

const router = express.Router()

router.post('/register', registerOrganization)
router.post('/login', login)
router.post('/update', userAuth, update)
router.post('/isExists', userAuth, isExist)
export default router
