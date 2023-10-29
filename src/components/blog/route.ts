import express from 'express'
import { userAuth } from '../../middlewares/auth'
import { createBlog, getAllblogs, getBlog, searchBlog } from './controller'

const router = express.Router()

router.post('/createBlog', userAuth, createBlog)
router.get('/getallblogs', getAllblogs)
router.get('/getblog/:slug', getBlog)
router.get('/search', searchBlog)
export default router
