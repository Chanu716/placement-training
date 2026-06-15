const users = [];
let nextUserId = 1;

function listUsers() {
  return users;
}

function getUserById(id) {
  return users.find((user) => user.id === id);
}

function createUser(name, email) {
  const user = {
    id: nextUserId++,
    name,
    email,
  };

  users.push(user);
  return user;
}

function updateUser(id, name, email) {
  const user = getUserById(id);
  if (!user) {
    return null;
  }

  if (name !== undefined) {
    user.name = name;
  }
  if (email !== undefined) {
    user.email = email;
  }

  return user;
}

function deleteUser(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return false;
  }

  users.splice(index, 1);
  return true;
}

module.exports = {
  users,
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
