import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import gravatar from 'gravatar'
import { Role } from '../lib/users'

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Guest',
    },
    email: {
      type: String,
      required: [true, 'Set email for user'],
      unique: true,
      validate(value) {
        const reg = /\S+@\S+\.\S+/
        return reg.test(String(value).trim().toLocaleLowerCase())
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    role: {
      type: String,
      enum: {
        values: Object.values(Role),
        message: 'Role is not allowed',
      },
      default: Role.USER,
    },
    token: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true)
      },
    },
    idAvatarCloud: {
      type: String,
      default: null,
    },
    verify: { type: Boolean, default: false },
    verificationToken: {
      type: String,
      default: uuidv4(),
      required: [true, 'Verify token is required'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id
        return ret
      },
    },
  },
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(6)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)

export default User
