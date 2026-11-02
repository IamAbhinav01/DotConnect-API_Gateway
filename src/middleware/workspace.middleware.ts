import { type NextFunction, type Request, type Response } from 'express'
import { BadRequestError } from '../utils/errors/application.error.js'
import { User } from '../schema/mongoose.schema.js'

export const ResolveEmailUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = req.body?.role ?? 'member'

  // If userId is already provided (from table button click), forward directly!
  if (req.body?.userId) {
    req.body = {
      userId: req.body.userId,
      role: role,
    }
    return next()
  }

  const email = String(req.body?.email ?? '')
    .trim()
    .toLowerCase()

  if (!email) {
    return next(new BadRequestError('Email or User ID is required'))
  }

  const user = await User.findOne({ email }).select('_id email').lean()

  if (!user) {
    return next(
      new BadRequestError('User does not have an account with the application')
    )
  }

  req.body = {
    userId: user._id.toString(),
    role: role,
  }

  return next()
}
