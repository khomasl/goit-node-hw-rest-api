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
import guard from '../../../middlewares/guard'

const contactsRouter = new Router()

contactsRouter.get('/', guard, getContacts)

contactsRouter.get('/:id', [guard, validateId], getContactById)

contactsRouter.post('/', [guard, validateCreate], addContact)

contactsRouter.delete('/:id', [guard, validateId], deleteContact)

contactsRouter.put('/:id', [guard, validateId, validateUpdate], updateContact)

contactsRouter.patch(
  '/:id/favorite',
  validateId,
  validateUpdateFavorite,
  updateContact,
)

export default contactsRouter
