import { Router } from 'express'
import {
  signup,
  login,
  logout,
  current,
} from '../../../controllers/users/index'
import guard from '../../../middlewares/guard'
import { validateCreate } from './validation'

const usersRouter = new Router()

usersRouter.post('/signup', validateCreate, signup)
usersRouter.post('/login', validateCreate, login)
usersRouter.post('/logout', guard, logout)
usersRouter.get('/current', guard, current)

export default usersRouter
