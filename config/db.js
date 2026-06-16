const { MongoClient } = require("mongodb");

let client;
let db;

const connectDB = async () => {
  if (db) {
    return db;
  }

  const mongoUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017";
  const dbName = process.env.DB_NAME || "placement_training";

  client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db(dbName);

  console.log(`MongoDB connected to ${dbName}`);
  return db;
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }

  return db;
};

module.exports = {
  connectDB,
  getDB,
};
