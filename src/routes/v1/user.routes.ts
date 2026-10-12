import express from 'express'
import {
  validateLogin,
  validateSignup,
} from '../../middleware/user.middleware.js'
import {
  userLogin,
  userLogout,
  userSignup,
} from '../../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.post('/signup', validateSignup, userSignup)
userRouter.post('/login', validateLogin, userLogin)
userRouter.post('/logout', userLogout)

export default userRouter
