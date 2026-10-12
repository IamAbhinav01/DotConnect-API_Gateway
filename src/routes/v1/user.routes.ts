import express from 'express'
import {
  validateLogin,
  validateSignup,
} from '../../middleware/user.middleware.js'
import {
  userLogin,
  userLogout,
  userSignup,
  getCurrentUser,
} from '../../controllers/user.controller.js'
import { verifyJWT } from '../../middleware/auth.middleware.js'

const userRouter = express.Router()

userRouter.post('/signup', validateSignup, userSignup)
userRouter.post('/login', validateLogin, userLogin)
userRouter.post('/logout', userLogout)
userRouter.get('/me', verifyJWT, getCurrentUser)

export default userRouter
