import express from 'express'
import { userAuth } from '@middlewares/auth'
import { createBlog, getAllblogs, getBlog } from './controller'

const router = express.Router()

router.post('/createBlog', userAuth, createBlog)
router.get('/getallblogs', getAllblogs)
router.get('/getblog/:slug', getBlog)
export default router
