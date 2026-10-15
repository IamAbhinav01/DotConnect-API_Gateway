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
  listUsers,
  deleteUser,
  promoteUser,
  findUserById,
} from '../../controllers/user.controller.js'
import { requireAdmin, verifyJWT } from '../../middleware/auth.middleware.js'

const userRouter = express.Router()

userRouter.post('/signup', validateSignup, userSignup)
userRouter.post('/login', validateLogin, userLogin)
userRouter.post('/logout', userLogout)
userRouter.get('/me', verifyJWT, getCurrentUser)
userRouter.get('/:userId', verifyJWT, findUserById)
userRouter.get('/', verifyJWT, requireAdmin, listUsers)
userRouter.delete('/:userId', verifyJWT, requireAdmin, deleteUser)
userRouter.post('/:userId/promote', verifyJWT, requireAdmin, promoteUser)

export default userRouter
