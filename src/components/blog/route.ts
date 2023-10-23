import express from 'express'
import { userAuth } from '@middlewares/auth'
import { createBlog } from './controller'

const router = express.Router()

router.post('/createBlog', userAuth, createBlog)
export default router
