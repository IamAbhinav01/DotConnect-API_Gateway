import express from 'express'
import { validateSignup } from '../../middleware/user.middleware.js'
import { userSignup } from '../../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.post('/signup', validateSignup, userSignup)

export default userRouter
