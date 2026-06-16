require("dotenv").config();

const express = require("express");
const path = require("path");
const { connectDB } = require("./config/db");
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
const port = process.env.PORT || 3000;

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

app.get("/users", async (req, res) => {
  const users = await listUsers();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const user = await getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }

  const user = await createUser(name, email);
  res.status(201).json(user);
});

app.put("/users/:id", async (req, res) => {
  const user = await updateUser(req.params.id, req.body.name, req.body.email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  const deleted = await deleteUser(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(204).send();
});

app.get("/products", async (req, res) => {
  const products = await listProducts();
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.post("/products", async (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || price === undefined || stock === undefined) {
    return res
      .status(400)
      .json({ message: "name, price, and stock are required" });
  }

  const product = await createProduct(name, price, stock);
  res.status(201).json(product);
});

app.put("/products/:id", async (req, res) => {
  const product = await updateProduct(
    req.params.id,
    req.body.name,
    req.body.price,
    req.body.stock,
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.delete("/products/:id", async (req, res) => {
  const deleted = await deleteProduct(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(204).send();
});

app.get("/orders", async (req, res) => {
  const orders = await listOrders();
  res.json(orders);
});

app.get("/orders/:id", async (req, res) => {
  const order = await getOrderById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});

app.post("/orders", async (req, res) => {
  const result = await createOrder(
    req.body.userId,
    req.body.productId,
    Number(req.body.quantity || 1),
  );

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

app.put("/orders/:id", async (req, res) => {
  const quantity = Number(req.body.quantity);
  const result = await updateOrder(req.params.id, quantity);

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

app.delete("/orders/:id", async (req, res) => {
  const deleted = await deleteOrder(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(204).send();
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = app;
