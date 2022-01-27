import { Router } from 'express'
import {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
} from '../../../controllers/contacts/index'
import {
  validateCreate,
  validateUpdate,
  validateUpdateFavorite,
  validateId,
} from './validation'

import wrapperError from '../../../middlewares/error-handler'

import guard from '../../../middlewares/guard'

const contactsRouter = new Router()

contactsRouter.get('/', guard, getContacts)

contactsRouter.get('/:id', [guard, validateId], wrapperError(getContactById))

contactsRouter.post('/', [guard, validateCreate], wrapperError(addContact))

contactsRouter.delete('/:id', [guard, validateId], wrapperError(deleteContact))

contactsRouter.put(
  '/:id',
  [guard, validateId, validateUpdate],
  wrapperError(updateContact),
)

contactsRouter.patch(
  '/:id/favorite',
  validateId,
  validateUpdateFavorite,
  wrapperError(updateContact),
)

export default contactsRouter
