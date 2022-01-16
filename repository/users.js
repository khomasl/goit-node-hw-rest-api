import User from '../model/user'

const findById = async (id) => await User.findById(id)

const findByEmail = async (email) => await User.findOne({ email })

const create = async (body) => {
  const user = new User(body)
  return await user.save()
}

const updateToken = async (id, token) =>
  await User.updateOne({ _id: id }, { token })

const updateAvatar = async (id, avatar, idAvatarCloud = null) =>
  await User.updateOne({ _id: id }, { avatar, idAvatarCloud })

export default { findById, findByEmail, create, updateToken, updateAvatar }
