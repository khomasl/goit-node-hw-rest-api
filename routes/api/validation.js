import Joi from 'joi'

const idSchema = Joi.object({
  id: Joi.string().required,
})

const createSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
})

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
}).or('name', 'email', 'phone')

export const validateCreate = async (req, res, next) => {
  try {
    const value = await createSchema.validateAsync(req.body)
  } catch (error) {
    return res.status(400).json({ message: 'missing required name field' })
  }
}

export const validateUpdate = async (req, res, next) => {
  try {
    const value = await updateSchema.validateAsync(req.body)
  } catch (error) {
    return res.status(400).json({ message: 'missing fields' })
  }
}

export const validateId = async (req, res, next) => {
  try {
    const value = await idSchema.validateAsync(req.params)
  } catch (error) {
    return res.status(400).json({ message: 'missing fields' })
  }
}
