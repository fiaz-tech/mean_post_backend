import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  updatePost,
  storage,

 } from '../controllers/postController.js'
 import { protect } from '../middleware/authMiddleware.js'
 import multer from 'multer'

 import express from 'express'
const router = express.Router()



router.route('/')
.post(protect, multer({storage: storage}).single('image'), createPost)
.get(getPosts)


router.route('/:id/update').put(protect, multer({storage: storage}).single('image'), updatePost)

router.route('/:id')
.get(getPostById)
.delete(protect, deletePost)




export default router
