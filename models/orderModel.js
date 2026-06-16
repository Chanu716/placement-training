const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { getUserById } = require("./userModel");
const { getProductById } = require("./productModel");

const ordersCollection = () => getDB().collection("orders");

async function listOrders() {
  return await ordersCollection().find().toArray();
}

async function getOrderById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return await ordersCollection().findOne({ _id: new ObjectId(id) });
}

async function createOrder(userId, productId, quantity) {
  const user = await getUserById(userId);
  const product = await getProductById(productId);

  if (!user) {
    return { error: "User not found" };
  }

  if (!product) {
    return { error: "Product not found" };
  }

  if (quantity <= 0) {
    return { error: "Quantity should be greater than 0" };
  }

  if (product.stock < quantity) {
    return { error: "Not enough stock" };
  }

  await getDB()
    .collection("products")
    .updateOne({ _id: product._id }, { $inc: { stock: -quantity } });

  const order = {
    userId,
    productId,
    quantity,
    totalPrice: product.price * quantity,
  };

  const result = await ordersCollection().insertOne(order);
  return { order: { ...order, _id: result.insertedId } };
}

async function updateOrder(id, quantity) {
  const order = await getOrderById(id);

  if (!order) {
    return { error: "Order not found" };
  }

  const product = await getProductById(order.productId);

  if (!product) {
    return { error: "Product not found" };
  }

  if (quantity <= 0) {
    return { error: "Quantity should be greater than 0" };
  }

  const currentStock = product.stock + order.quantity;

  if (quantity > currentStock) {
    return { error: "Not enough stock" };
  }

  await getDB()
    .collection("products")
    .updateOne(
      { _id: product._id },
      { $set: { stock: currentStock - quantity } },
    );

  await ordersCollection().updateOne(
    { _id: order._id },
    {
      $set: {
        quantity,
        totalPrice: product.price * quantity,
      },
    },
  );

  return {
    order: {
      ...order,
      quantity,
      totalPrice: product.price * quantity,
    },
  };
}

async function deleteOrder(id) {
  const order = await getOrderById(id);

  if (!order) {
    return false;
  }

  const product = await getProductById(order.productId);

  if (product) {
    await getDB()
      .collection("products")
      .updateOne({ _id: product._id }, { $inc: { stock: order.quantity } });
  }

  const result = await ordersCollection().deleteOne({ _id: order._id });
  return result.deletedCount > 0;
}

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
