import asyncHandler from 'express-async-handler'

import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      expiresIn: 3600,
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {

  const { firstname, lastname, email, password} = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})





export {
  authUser,
  registerUser,

}



