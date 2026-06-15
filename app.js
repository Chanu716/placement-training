const express = require("express");
const path = require("path");
const {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("./models/userModel");
const {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./models/productModel");
const {
  listOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("./models/orderModel");

const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/users", (req, res) => {
  res.json(listUsers());
});

app.get("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const user = getUserById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }

  const user = createUser(name, email);
  res.status(201).json(user);
});

app.put("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const user = updateUser(userId, req.body.name, req.body.email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const deleted = deleteUser(Number(req.params.id));

  if (!deleted) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(204).send();
});

app.get("/products", (req, res) => {
  res.json(listProducts());
});

app.get("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = getProductById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.post("/products", (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || price === undefined || stock === undefined) {
    return res
      .status(400)
      .json({ message: "name, price, and stock are required" });
  }

  const product = createProduct(name, price, stock);
  res.status(201).json(product);
});

app.put("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = updateProduct(
    productId,
    req.body.name,
    req.body.price,
    req.body.stock,
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.delete("/products/:id", (req, res) => {
  const deleted = deleteProduct(Number(req.params.id));

  if (!deleted) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(204).send();
});

app.get("/orders", (req, res) => {
  res.json(listOrders());
});

app.get("/orders/:id", (req, res) => {
  const orderId = Number(req.params.id);
  const order = getOrderById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});

app.post("/orders", (req, res) => {
  const userId = Number(req.body.userId);
  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity || 1);
  const result = createOrder(userId, productId, quantity);

  if (result.error) {
    if (
      result.error === "User not found" ||
      result.error === "Product not found"
    ) {
      return res.status(404).json({ message: result.error });
    }

    return res.status(400).json({ message: result.error });
  }

  res.status(201).json(result.order);
});

app.put("/orders/:id", (req, res) => {
  const orderId = Number(req.params.id);
  const quantity = Number(req.body.quantity);
  const result = updateOrder(orderId, quantity);

  if (result.error) {
    if (
      result.error === "Order not found" ||
      result.error === "Product not found"
    ) {
      return res.status(404).json({ message: result.error });
    }

    return res.status(400).json({ message: result.error });
  }

  res.json(result.order);
});

app.delete("/orders/:id", (req, res) => {
  const deleted = deleteOrder(Number(req.params.id));

  if (!deleted) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
