import fs from 'fs/promises'
import contactsPath, { dirname } from 'path'
import crypto from 'crypto' //метод для шифрования и генерации id
import contacts from './contacts.json'
import { fileURLToPath } from 'url'
const __dirname = contactsPath.dirname(fileURLToPath(import.meta.url))

const writeContent = async () =>
  await fs.writeFile(
    contactsPath.join(__dirname, 'contacts.json'),
    JSON.stringify(contacts, null, 2),
  )

const listContacts = async () => contacts

const getContactById = async (contactId) =>
  contacts.find((contact) => contact.id === contactId)

const addContact = async ({ name, email, phone }) => {
  const newContact = { name, email, phone, id: crypto.randomUUID() }
  contacts.push(newContact)
  await writeContent()
  return newContact
}

const removeContact = async (contactId) => {
  const id = contacts.findIndex((contact) => contact.id === contactId)
  if (id === -1) return
  const contact = contacts.splice(id, 1)
  await writeContent()
  return contact
}

const updateContact = async (contactId, body) => {
  const id = contacts.findIndex((contact) => contact.id === contactId)
  if (id === -1) return
  const updatedContact = { id: contactId, ...contacts[id], ...body }
  contacts[id] = updateContact
  await writeContent()
  return updatedContact
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}
