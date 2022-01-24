import jwt from 'jsonwebtoken'
import Users from '../../repository/users'

const SECRET_KEY = process.env.JWT_SECRET_KEY

class UserService {
  async isUserExist(email) {
    const user = await Users.findByEmail(email)
    return !!user
  }

  async create(body) {
    const {
      id,
      name,
      email,
      role,
      avatar,
      verificationToken,
    } = await Users.create(body)
    return { id, name, email, role, avatar, verificationToken }
  }

  async getUser(email, password) {
    const user = await Users.findByEmail(email)
    const isValidPassword = await user?.isValidPassword(password)
    if (!isValidPassword || !user?.verify) {
      return null
    }
    return user
  }

  getToken(user) {
    const id = user.id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
    return token
  }

  async setToken(id, token) {
    await Users.updateToken(id, token)
  }
}

export default new UserService()
