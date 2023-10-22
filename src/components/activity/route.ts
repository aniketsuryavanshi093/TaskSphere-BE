import { userAuth } from '@middlewares/auth'
import { Router } from 'express'
import { getAllActivity } from './controller'

const router = Router()

router.use(userAuth)
router.get('/all', getAllActivity)

export default router
