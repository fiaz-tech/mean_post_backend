import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  updatePost,

 } from '../controllers/postController.js'
 import { protect } from '../middleware/authMiddleware.js'
 import  upload from '../middleware/multer.js'


 import express from 'express'
const router = express.Router()



router.route('/')
.post(protect, upload.single('image'), createPost)
.get(getPosts)


router.route('/:id/update').put(protect, upload.single('image'), updatePost)

router.route('/:id')
.get(getPostById)
.delete(protect, deletePost)




export default router
