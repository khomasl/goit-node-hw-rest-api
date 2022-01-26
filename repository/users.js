import User from '../model/user'

const findById = async (id) => await User.findById(id)

const findByEmail = async (email) => await User.findOne({ email })

const findByVerifyToken = async (verificationToken) =>
  await User.findOne({ verificationToken })

const create = async (body) => {
  const user = new User(body)
  return await user.save()
}

const updateToken = async (id, token) =>
  await User.updateOne({ _id: id }, { token })

const updateVerify = async (id, status) =>
  await User.updateOne(
    { _id: id },
    { verify: status },
    { verificationToken: null },
  )

const updateAvatar = async (id, avatar, idAvatarCloud = null) =>
  await User.updateOne({ _id: id }, { avatar, idAvatarCloud })

export default {
  findById,
  findByEmail,
  create,
  updateToken,
  updateAvatar,
  updateVerify,
  findByVerifyToken,
}
