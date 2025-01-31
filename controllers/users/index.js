import { HttpCode } from '../../lib/constants'
import { CustomError } from '../../lib/custom-error'
import repositoryUsers from '../../repository/users'
import userService from '../../service/users'
import { EmailService, SenderSendGrid } from '../../service/email'
// eslint-disable-next-line no-unused-vars
import {
  UploadFileService,
  LocalFileService,
  CloudFileService,
} from '../../service/file-storage'

const signup = async (req, res, next) => {
  const { email } = req.body
  const isUserExist = await userService.isUserExist(email)
  if (isUserExist) {
    throw new CustomError(HttpCode.CONFLICT, 'Email is already exist')
  }
  const userData = await userService.create(req.body)

  const emailService = new EmailService(
    process.env.NODE_ENV,
    new SenderSendGrid(),
  )
  const isSend = await emailService.sendVerifyEmail(
    email,
    userData.name,
    userData.verificationToken,
  )

  delete userData.verificationToken

  res.status(HttpCode.CREATED).json({
    status: 'success',
    code: HttpCode.CREATED,
    data: { ...userData, isSendEmailVerify: isSend },
  })
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await userService.getUser(email, password)
  if (!user) {
    throw new CustomError(HttpCode.UNAUTHORIZED, 'Invalid credentials')
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
    throw new CustomError(HttpCode.UNAUTHORIZED, 'Not authorized')
  }
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { email: user.email, subscription: 'starter' },
  })
}

const uploadAvatar = async (req, res, next) => {
  const uploadService = new UploadFileService(
    // CloudFileService,
    LocalFileService,
    req.file,
    req.user,
  )

  const avatarUrl = await uploadService.updateAvatar()

  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { avatarUrl } })
}

const verifyUser = async (req, res, next) => {
  const verificationToken = req.params.verificationToken
  const userFromToken = await repositoryUsers.findByVerifyToken(
    verificationToken,
  )
  if (userFromToken) {
    await repositoryUsers.updateVerify(userFromToken.id, true)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      ResponseBody: { message: 'Verification successful' },
    })
  }
  throw new CustomError(HttpCode.BAD_REQUEST, 'User not found')
}

const repeatVerifyUser = async (req, res, next) => {
  const { email } = req.body
  if (!email) {
    throw new CustomError(HttpCode.BAD_REQUEST, 'Missing required field email')
  }

  const user = await repositoryUsers.findByEmail(email)

  if (user) {
    const { email, name, verificationToken } = user

    const emailService = new EmailService(
      process.env.NODE_ENV,
      new SenderSendGrid(),
    )
    const isSend = await emailService.sendVerifyEmail(
      email,
      name,
      verificationToken,
    )
    if (isSend) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        ResponseBody: { message: 'Verification email sent' },
      })
    }
    throw new CustomError(HttpCode.SU, 'Service Unavailable')
  }
  throw new CustomError(
    HttpCode.BAD_REQUEST,
    'Verification is already been passed',
  )
}

export {
  signup,
  login,
  logout,
  current,
  uploadAvatar,
  verifyUser,
  repeatVerifyUser,
}
