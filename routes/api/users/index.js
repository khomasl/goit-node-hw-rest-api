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
import guard from '../../../middlewares/guard'
import { upload } from '../../../middlewares/upload'
import { validateCreate } from './validation'

const usersRouter = new Router()

usersRouter.post('/signup', validateCreate, signup)
usersRouter.post('/login', validateCreate, login)
usersRouter.post('/logout', guard, logout)
usersRouter.get('/current', guard, current)

usersRouter.patch('/avatars', guard, upload.single('avatar'), uploadAvatar)
usersRouter.get('/verify/:verificationToken', verifyUser)
usersRouter.post('/verify', repeatVerifyUser)

export default usersRouter
