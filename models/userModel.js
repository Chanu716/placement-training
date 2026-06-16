const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const usersCollection = () => getDB().collection("users");

async function listUsers() {
  return await usersCollection().find().toArray();
}

async function getUserById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return await usersCollection().findOne({ _id: new ObjectId(id) });
}

async function createUser(name, email) {
  const user = { name, email };
  const result = await usersCollection().insertOne(user);

  return { ...user, _id: result.insertedId };
}

async function updateUser(id, name, email) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (email !== undefined) {
    updates.email = email;
  }

  const result = await usersCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return await getUserById(id);
}

async function deleteUser(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await usersCollection().deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount > 0;
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
