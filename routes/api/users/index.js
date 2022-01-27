import { Router } from 'express'
import {
  signup,
  login,
  logout,
  current,
  uploadAvatar,
  verifyUser,
  repeatVerifyUser,
} from '../../../controllers/users/index'
import wrapperError from '../../../middlewares/error-handler'
import guard from '../../../middlewares/guard'
import { upload } from '../../../middlewares/upload'
import { validateCreate } from './validation'

const usersRouter = new Router()

usersRouter.post('/signup', validateCreate, wrapperError(signup))
usersRouter.post('/login', validateCreate, wrapperError(login))
usersRouter.post('/logout', guard, wrapperError(logout))
usersRouter.get('/current', guard, wrapperError(current))

usersRouter.patch(
  '/avatars',
  guard,
  upload.single('avatar'),
  wrapperError(uploadAvatar),
)
usersRouter.get('/verify/:verificationToken', wrapperError(verifyUser))
usersRouter.post('/verify', wrapperError(repeatVerifyUser))

export default usersRouter
