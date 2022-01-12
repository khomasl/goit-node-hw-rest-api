import { HttpCode } from '../../lib/constants'
import UserService from '../../service/users'

const userService = new UserService()

const signup = async (req, res, next) => {
  const { email } = req.body
  const isUserExist = await userService.isUserExist(email)
  if (isUserExist) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email is already exist',
    })
  }
  const data = await userService.create(req.body)
  res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data })
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await userService.getUser(email, password)
  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Invalid credentials',
    })
  }
  const token = userService.getToken(user)
  await userService.setToken(user.id, token)
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { token } })
}

const logout = async (req, res, next) => {
  await userService.setToken(req.user.id, null)
  res
    .status(HttpCode.NO_CONTENT)
    .json({ status: 'success', code: HttpCode.NO_CONTENT, data: {} })
}

const current = (req, res, next) => {
  const user = req.user
  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Not authorized',
    })
  }
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { email: user.email, subscription: 'starter' },
  })
}

export { signup, login, logout, current }
