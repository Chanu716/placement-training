const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const productsCollection = () => getDB().collection("products");

async function listProducts() {
  return await productsCollection().find().toArray();
}

async function getProductById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return await productsCollection().findOne({ _id: new ObjectId(id) });
}

async function createProduct(name, price, stock) {
  const product = {
    name,
    price: Number(price),
    stock: Number(stock),
  };
  const result = await productsCollection().insertOne(product);

  return { ...product, _id: result.insertedId };
}

async function updateProduct(id, name, price, stock) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (price !== undefined) {
    updates.price = Number(price);
  }

  if (stock !== undefined) {
    updates.stock = Number(stock);
  }

  const result = await productsCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return await getProductById(id);
}

async function deleteProduct(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await productsCollection().deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount > 0;
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
