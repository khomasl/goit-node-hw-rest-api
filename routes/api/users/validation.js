import Joi from 'joi'
import { HttpCode } from '../../../lib/constants'

const createSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const validateCreate = async (req, res, next) => {
  try {
    await createSchema.validateAsync(req.body)
  } catch (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: 'missing required name field' })
  }
  next()
}
