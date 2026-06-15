const products = [];
let nextProductId = 1;

function listProducts() {
  return products;
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function createProduct(name, price, stock) {
  const product = {
    id: nextProductId++,
    name,
    price: Number(price),
    stock: Number(stock),
  };

  products.push(product);
  return product;
}

function updateProduct(id, name, price, stock) {
  const product = getProductById(id);
  if (!product) {
    return null;
  }

  if (name !== undefined) {
    product.name = name;
  }
  if (price !== undefined) {
    product.price = Number(price);
  }
  if (stock !== undefined) {
    product.stock = Number(stock);
  }

  return product;
}

function deleteProduct(id) {
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    return false;
  }

  products.splice(index, 1);
  return true;  
}

module.exports = {
  products,
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
