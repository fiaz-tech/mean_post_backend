import {
  authUser,
  registerUser,
 } from '../controllers/userController.js'

import express from 'express'
const router = express.Router()

//import { protect } from '../middleware/authMiddleware.js'



router.route('/register').post(registerUser)
//router.route('/getAll').get(getAllUsers)
router.post('/login', authUser)

//router.route('/profile')
//.get(protect, getUserProfile)


//router.route('/:id').delete(protect, deleteUser).put(updateUser)


export default router
