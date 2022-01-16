import { jest } from '@jest/globals'
import { signup } from './index'
import userService from '../../service/users'
import { HttpCode } from '../../lib/constants'

describe('Unit test signup', () => {
  let req, res, next
  beforeEach(() => {
    req = {
      body: { email: 'test@test.com', password: '12345678' },
    }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn((data) => data) }
    next = jest.fn()
    userService.create = jest.fn(async (data) => data)
  })

  test('SignUp: New user', async () => {
    userService.isUserExist = jest.fn(async () => false)
    await signup(req, res, next)
    expect(userService.isUserExist).toHaveBeenCalledWith(req.body.email)
    expect(res.status).toHaveBeenCalledWith(HttpCode.CREATED)
  })

  test('SignUp: User is already exist', async () => {
    userService.isUserExist = jest.fn(async () => true)
    await signup(req, res, next)
    expect(userService.isUserExist).toHaveBeenCalledWith(req.body.email)
    expect(res.status).toHaveBeenCalledWith(HttpCode.CONFLICT)
  })

  test('SignUp: With error database', async () => {
    const testError = new Error('Database Error')
    userService.isUserExist = jest.fn(async () => {
      throw testError
    })
    await signup(req, res, next)
    expect(userService.isUserExist).toHaveBeenCalledWith(req.body.email)
    expect(next).toHaveBeenCalledWith(testError)
  })
})
