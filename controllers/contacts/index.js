import repositoryContacts from '../../repository/contacts'
import { HttpCode } from '../../lib/constants'

const getContacts = async (req, res, next) => {
  const { id: userId } = req.user
  const contacts = await repositoryContacts.listContacts(userId)
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { contacts } })
}

const getContactById = async (req, res, next) => {
  const { id: userId } = req.user
  const { id } = req.params
  const contact = await repositoryContacts.getContactById(userId, id)
  contact
    ? res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { contact } })
    : res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      })
}

const addContact = async (req, res, next) => {
  const { id: userId } = req.user
  const newContact = await repositoryContacts.addContact(userId, req.body)
  res
    .status(HttpCode.CREATED)
    .json({ status: 'success', code: HttpCode.OK, data: { newContact } })
}

const deleteContact = async (req, res, next) => {
  const { id: userId } = req.user
  const { id } = req.params
  const contact = await repositoryContacts.getContactById(userId, id)
  if (!contact) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    })
  }
  await repositoryContacts.removeContact(id)
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, message: 'contact deleted' })
}

const updateContact = async (req, res, next) => {
  const { id: userId } = req.user
  const { id } = req.params
  const contact = await repositoryContacts.updateContact(userId, id, req.body)
  contact
    ? res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { contact } })
    : res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      })
}

export { getContacts, getContactById, addContact, deleteContact, updateContact }
