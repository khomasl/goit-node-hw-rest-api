import Contact from '../model/contact'

const listContacts = async () => await Contact.find()

const getContactById = async (contactId) => await Contact.findById(contactId)

const addContact = async (body) => await Contact.create(body)

const removeContact = async (contactId) =>
  await Contact.findByIdAndRemove(contactId)

const updateContact = async (contactId, body) =>
  await Contact.findByIdAndUpdate(contactId, { ...body }, { new: true })

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}
