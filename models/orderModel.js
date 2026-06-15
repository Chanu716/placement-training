const orders = [];
let nextOrderId = 1;

const { getUserById } = require("./userModel");
const { getProductById } = require("./productModel");

function listOrders() {
  return orders;
}

function getOrderById(id) {
  return orders.find((order) => order.id === id);
}

function createOrder(userId, productId, quantity) {
  const user = getUserById(userId);
  const product = getProductById(productId);

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

  product.stock = product.stock - quantity;

  const order = {
    id: nextOrderId++,
    userId,
    productId,
    quantity,
    totalPrice: product.price * quantity,
  };

  orders.push(order);
  return { order };
}

function updateOrder(id, quantity) {
  const order = getOrderById(id);

  if (!order) {
    return { error: "Order not found" };
  }

  const product = getProductById(order.productId);

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

  product.stock = currentStock - quantity;
  order.quantity = quantity;
  order.totalPrice = product.price * quantity;

  return { order };
}

function deleteOrder(id) {
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) {
    return false;
  }

  const order = orders[index];
  const product = getProductById(order.productId);

  if (product) {
    product.stock = product.stock + order.quantity;
  }

  orders.splice(index, 1);
  return true;
}

module.exports = {
  orders,
  listOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
