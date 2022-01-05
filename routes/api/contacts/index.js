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

const contactsRouter = new Router()

contactsRouter.get('/', getContacts)

contactsRouter.get('/:id', getContactById)

contactsRouter.post('/', validateCreate, addContact)

contactsRouter.delete('/:id', validateId, deleteContact)

contactsRouter.put('/:id', validateId, validateUpdate, updateContact)

contactsRouter.patch(
  '/:id/favorite',
  validateId,
  validateUpdateFavorite,
  updateContact,
)

export default contactsRouter
