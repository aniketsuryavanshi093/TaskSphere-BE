import express from 'express'
import { userAuth } from '../../middlewares/auth'
import {
  createBlog,
  getAllblogs,
  getBlog,
  searchBlog,
  updateBlog,
  getAllusersBlog,
} from './controller'

const router = express.Router()

router.post('/createBlog', userAuth, createBlog)
router.post('/updateblog/:id', userAuth, updateBlog)
router.get('/usersblog/:id', getAllusersBlog)
router.get('/getallblogs', getAllblogs)
router.get('/getblog/:slug', getBlog)
router.get('/search', searchBlog)
export default router
