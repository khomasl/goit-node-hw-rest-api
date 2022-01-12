import Contact from '../model/contact'

const listContacts = async (
  userId,
  sortBy,
  sortByDesc,
  filter,
  limit = 20,
  skip = 0,
) => {
  let sortCriteria = null
  const total = await Contact.find({ owner: userId }).countDocuments()
  let result = Contact.find({ owner: userId }).populate({
    path: 'owner',
    select: 'name, email, role',
  })
  if (sortBy) {
    sortCriteria = { [`${sortBy}`]: 1 }
  }
  if (sortByDesc) {
    sortCriteria = { [`${sortByDesc}`]: -1 }
  }
  if (filter) {
    result = result.select(filter.split('&').join(' ')) // 'name age'
  }
  result = await result
    .skip(Number(skip))
    .limit(Number(limit))
    .sort(sortCriteria)
  return { total, contacts: result }
}

const getContactById = async (userId, contactId) =>
  await Contact.findOne({ _id: contactId, owner: userId })

const addContact = async (userId, body) =>
  await Contact.create({ ...body, owner: userId })

const removeContact = async (userId, contactId) =>
  await Contact.findOneAndRemove({ _id: contactId, owner: userId })

const updateContact = async (userId, contactId, body) =>
  await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  )

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}
